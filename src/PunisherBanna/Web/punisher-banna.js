(function () {
    "use strict";

    const componentName = "punisher-banna-carousel";
    if (window.__punisherBannaV2 || customElements.get(componentName)) {
        return;
    }

    const componentCss = `
        :host {
            --height: clamp(15rem, 32vw, 29rem);
            --mobile-height: 13.5rem;
            --radius: .7rem;
            display: block;
            margin: 0 auto 1.4rem;
            max-width: 100%;
            width: 93.4%;
        }
        :host([size="small"]) {
            --height: clamp(12rem, 25vw, 22rem);
            --mobile-height: 11rem;
            --radius: .6rem;
            width: 88%;
        }
        :host([size="large"]) {
            --height: clamp(18rem, 39vw, 36rem);
            --mobile-height: 17rem;
            --radius: .8rem;
            width: 98%;
        }
        * { box-sizing: border-box; }
        .stage {
            background: #141414;
            border-radius: var(--radius);
            box-shadow: 0 .35rem 1.4rem rgba(0, 0, 0, .32);
            cursor: grab;
            height: var(--height);
            overflow: hidden;
            position: relative;
            touch-action: pan-y;
        }
        :host([artwork="banner"]) .stage {
            aspect-ratio: var(--banner-ratio, 1000 / 185);
            height: auto;
        }
        .stage.dragging { cursor: grabbing; }
        .card {
            -webkit-user-drag: none;
            color: #fff;
            inset: 0;
            opacity: 0;
            overflow: hidden;
            position: absolute;
            text-decoration: none;
            transform: translateX(0);
            transition: opacity 380ms ease, transform 160ms ease;
            user-select: none;
            visibility: hidden;
        }
        .card.current {
            opacity: 1;
            visibility: visible;
            z-index: 1;
        }
        .stage.dragging .card.current {
            transform: translateX(var(--drag-x, 0));
            transition: none;
        }
        .artwork {
            -webkit-user-drag: none;
            height: 100%;
            inset: 0;
            object-fit: cover;
            object-position: var(--image-anchor, center center);
            position: absolute;
            width: 100%;
        }
        :host([artwork="banner"]) .artwork { object-fit: contain; object-position: center; }
        .shade {
            background:
                linear-gradient(90deg, rgba(0, 0, 0, .87), rgba(0, 0, 0, .46) 40%, rgba(0, 0, 0, .03) 74%),
                linear-gradient(0deg, rgba(0, 0, 0, .5), transparent 42%);
            inset: 0;
            position: absolute;
        }
        .caption {
            align-items: flex-start;
            bottom: clamp(2.2rem, 5vw, 4.5rem);
            display: flex;
            flex-direction: column;
            gap: .8rem;
            left: clamp(2rem, 5vw, 5rem);
            max-width: min(44rem, 64%);
            position: absolute;
            z-index: 2;
        }
        .media-logo {
            -webkit-user-drag: none;
            filter: drop-shadow(0 .15rem .35rem rgba(0, 0, 0, .65));
            max-height: clamp(4.5rem, 10vw, 8.5rem);
            max-width: min(31rem, 70vw);
            object-fit: contain;
            object-position: left bottom;
        }
        .title {
            font-size: clamp(1.8rem, 4.3vw, 4.2rem);
            font-weight: 700;
            line-height: 1.05;
            margin: 0;
            text-shadow: 0 .15rem .45rem rgba(0, 0, 0, .85);
        }
        .facts {
            align-items: center;
            display: flex;
            font-size: clamp(.86rem, 1.25vw, 1.05rem);
            font-weight: 600;
            gap: .75rem;
            text-shadow: 0 .1rem .3rem #000;
        }
        .score { color: #f7ce46; }
        .step {
            align-items: center;
            background: rgba(0, 0, 0, .4);
            border: 0;
            border-radius: 50%;
            color: #fff;
            cursor: pointer;
            display: flex;
            font-size: 2rem;
            height: 3rem;
            justify-content: center;
            padding: 0;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 3rem;
            z-index: 3;
        }
        .step:hover, .step:focus-visible { background: rgba(0, 0, 0, .75); }
        .back { left: .7rem; }
        .forward { right: .7rem; }
        .pages {
            bottom: .85rem;
            display: flex;
            gap: .42rem;
            left: 50%;
            position: absolute;
            transform: translateX(-50%);
            z-index: 3;
        }
        .page {
            background: rgba(255, 255, 255, .46);
            border: 0;
            border-radius: 1rem;
            cursor: pointer;
            height: .45rem;
            padding: 0;
            transition: background 180ms ease, width 180ms ease;
            width: .45rem;
        }
        .page.current { background: #fff; width: 1.4rem; }
        @media (max-width: 600px) {
            .stage { height: var(--mobile-height); }
            .caption { bottom: 2.1rem; left: 1.35rem; max-width: 75%; }
            .step { height: 2.35rem; width: 2.35rem; }
            .back { left: .35rem; }
            .forward { right: .35rem; }
        }
        @media (prefers-reduced-motion: reduce) {
            .card, .page { transition: none; }
        }
    `;

    class PunisherBannaCarousel extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: "open" });
            this.api = null;
            this.payload = null;
            this.position = 0;
            this.rotation = null;
            this.pointer = null;
            this.dragging = false;
            this.blockClick = false;
            this.blockClickTimer = null;

            const style = document.createElement("style");
            style.textContent = componentCss;
            this.shadowRoot.appendChild(style);

            this.stage = document.createElement("div");
            this.stage.className = "stage";
            this.stage.setAttribute("role", "region");
            this.stage.setAttribute("aria-label", "Zufällige Filme und Serien");
            this.shadowRoot.appendChild(this.stage);
        }

        connectedCallback() {
            this.startRotation();
        }

        disconnectedCallback() {
            this.stopRotation();
        }

        configure(api, payload) {
            this.api = api;
            this.payload = payload;
            this.position = 0;
            this.setAttribute("size", ["small", "standard", "large"].includes(payload.size) ? payload.size : "standard");
            const bannerMode = payload.slides[0]?.artwork === "Banner";
            this.setAttribute("artwork", bannerMode ? "banner" : "backdrop");
            this.style.maxWidth = bannerMode ? "1000px" : "100%";
            this.stage.style.setProperty("--banner-ratio", "1000 / 185");
            const anchors = { top: "center top", center: "center center", bottom: "center bottom" };
            this.stage.style.setProperty("--image-anchor", anchors[payload.anchor] || anchors.center);
            this.renderCards();
            this.bindStageEvents();
            this.startRotation();
        }

        renderCards() {
            this.stage.replaceChildren();
            this.payload.slides.forEach((slide, index) => {
                this.stage.appendChild(this.makeCard(slide, index));
            });

            if (this.payload.slides.length > 1 && this.payload.arrows) {
                this.stage.append(
                    this.makeStepButton("back", "‹", "Vorheriges Banner", -1),
                    this.makeStepButton("forward", "›", "Nächstes Banner", 1)
                );
            }

            if (this.payload.slides.length > 1 && this.payload.dots) {
                const pages = document.createElement("div");
                pages.className = "pages";
                this.payload.slides.forEach((slide, index) => {
                    const page = document.createElement("button");
                    page.type = "button";
                    page.className = `page${index === 0 ? " current" : ""}`;
                    page.setAttribute("aria-label", `${slide.title} anzeigen`);
                    page.setAttribute("aria-current", index === 0 ? "true" : "false");
                    page.addEventListener("click", () => {
                        this.goTo(index);
                        this.startRotation();
                    });
                    pages.appendChild(page);
                });
                this.stage.appendChild(pages);
            }
        }

        makeCard(slide, index) {
            const card = document.createElement("a");
            card.className = `card${index === 0 ? " current" : ""}`;
            card.href = this.detailsUrl(slide.id);
            card.draggable = false;
            card.tabIndex = index === 0 ? 0 : -1;
            card.setAttribute("aria-hidden", index === 0 ? "false" : "true");
            card.setAttribute("aria-label", `${slide.title} öffnen`);

            const isBanner = slide.artwork === "Banner";
            const artwork = document.createElement("img");
            artwork.className = "artwork";
            artwork.alt = "";
            artwork.draggable = false;
            artwork.loading = index === 0 ? "eager" : "lazy";
            if (isBanner) {
                artwork.addEventListener("load", () => {
                    card.dataset.artworkWidth = String(artwork.naturalWidth);
                    card.dataset.artworkHeight = String(artwork.naturalHeight);
                    if (card.classList.contains("current")) {
                        this.applyBannerGeometry(card);
                    }
                }, { once: true });
            }
            artwork.src = this.imageUrl(slide.id, slide.artwork, isBanner ? null : 1920);
            card.appendChild(artwork);

            const shade = document.createElement("div");
            shade.className = "shade";
            card.appendChild(shade);

            const caption = document.createElement("div");
            caption.className = "caption";
            if (!isBanner && slide.logo) {
                const logo = document.createElement("img");
                logo.className = "media-logo";
                logo.src = this.imageUrl(slide.id, "Logo", 700);
                logo.alt = slide.title;
                logo.draggable = false;
                logo.loading = index === 0 ? "eager" : "lazy";
                logo.addEventListener("error", () => {
                    logo.replaceWith(this.makeTitle(slide.title));
                }, { once: true });
                caption.appendChild(logo);
            } else {
                caption.appendChild(this.makeTitle(slide.title));
            }

            const facts = document.createElement("div");
            facts.className = "facts";
            const kind = document.createElement("span");
            kind.textContent = slide.mediaKind === "series" ? "Serie" : "Film";
            facts.appendChild(kind);
            const numericScore = Number(slide.score);
            if (this.payload.rating && slide.score !== null && Number.isFinite(numericScore)) {
                const score = document.createElement("span");
                score.className = "score";
                score.textContent = `★ ${numericScore.toFixed(1)}`;
                facts.appendChild(score);
            }
            caption.appendChild(facts);
            card.appendChild(caption);
            return card;
        }

        makeTitle(text) {
            const title = document.createElement("h2");
            title.className = "title";
            title.textContent = text;
            return title;
        }

        makeStepButton(className, symbol, label, offset) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = `step ${className}`;
            button.textContent = symbol;
            button.setAttribute("aria-label", label);
            button.addEventListener("click", () => {
                this.goTo(this.position + offset);
                this.startRotation();
            });
            return button;
        }

        bindStageEvents() {
            if (this.stage.dataset.eventsBound) {
                return;
            }
            this.stage.dataset.eventsBound = "true";
            this.stage.addEventListener("mouseenter", () => this.stopRotation());
            this.stage.addEventListener("mouseleave", () => this.startRotation());
            this.stage.addEventListener("focusin", () => this.stopRotation());
            this.stage.addEventListener("focusout", event => {
                if (!this.stage.contains(event.relatedTarget)) {
                    this.startRotation();
                }
            });
            this.stage.addEventListener("keydown", event => this.handleKeyboard(event));
            this.stage.addEventListener("pointerdown", event => this.beginPointer(event));
            this.stage.addEventListener("pointermove", event => this.movePointer(event));
            this.stage.addEventListener("pointerup", event => this.endPointer(event, false));
            this.stage.addEventListener("pointercancel", event => this.endPointer(event, true));
            this.stage.addEventListener("click", event => {
                if (this.blockClick) {
                    this.blockClick = false;
                    window.clearTimeout(this.blockClickTimer);
                    event.preventDefault();
                    event.stopImmediatePropagation();
                }
            }, true);
        }

        handleKeyboard(event) {
            if (this.payload.slides.length < 2 || !["ArrowLeft", "ArrowRight"].includes(event.key)) {
                return;
            }
            event.preventDefault();
            this.goTo(this.position + (event.key === "ArrowRight" ? 1 : -1));
            this.startRotation();
        }

        beginPointer(event) {
            if (this.payload.slides.length < 2
                || this.pointer !== null
                || event.target.closest("button")
                || (event.pointerType === "mouse" && event.button !== 0)) {
                return;
            }
            this.pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
            this.stage.setPointerCapture?.(event.pointerId);
        }

        movePointer(event) {
            if (this.pointer?.id !== event.pointerId) {
                return;
            }
            const dx = event.clientX - this.pointer.x;
            const dy = event.clientY - this.pointer.y;
            if (!this.dragging) {
                if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
                    return;
                }
                if (Math.abs(dy) >= Math.abs(dx)) {
                    this.clearPointer();
                    return;
                }
                this.dragging = true;
                this.stopRotation();
                this.stage.classList.add("dragging");
            }
            event.preventDefault();
            const limit = this.stage.clientWidth * .35;
            this.stage.style.setProperty("--drag-x", `${Math.max(-limit, Math.min(limit, dx))}px`);
        }

        endPointer(event, cancelled) {
            if (this.pointer?.id !== event.pointerId) {
                return;
            }
            const wasDragging = this.dragging;
            const dx = event.clientX - this.pointer.x;
            if (wasDragging && !cancelled) {
                event.preventDefault();
                this.blockClick = true;
                window.clearTimeout(this.blockClickTimer);
                this.blockClickTimer = window.setTimeout(() => { this.blockClick = false; }, 400);
                const minimum = Math.min(80, Math.max(45, this.stage.clientWidth * .08));
                if (Math.abs(dx) >= minimum) {
                    this.goTo(this.position + (dx < 0 ? 1 : -1));
                }
            }
            this.clearPointer();
            if (wasDragging) {
                this.startRotation();
            }
        }

        clearPointer() {
            if (this.pointer && this.stage.hasPointerCapture?.(this.pointer.id)) {
                this.stage.releasePointerCapture(this.pointer.id);
            }
            this.pointer = null;
            this.dragging = false;
            this.stage.classList.remove("dragging");
            this.stage.style.removeProperty("--drag-x");
        }

        goTo(index) {
            const count = this.payload.slides.length;
            if (count === 0) {
                return;
            }
            this.position = (index + count) % count;
            this.stage.querySelectorAll(".card").forEach((card, cardIndex) => {
                const current = cardIndex === this.position;
                card.classList.toggle("current", current);
                card.setAttribute("aria-hidden", current ? "false" : "true");
                card.tabIndex = current ? 0 : -1;
            });
            this.stage.querySelectorAll(".page").forEach((page, pageIndex) => {
                const current = pageIndex === this.position;
                page.classList.toggle("current", current);
                page.setAttribute("aria-current", current ? "true" : "false");
            });
            this.applyBannerGeometry(this.stage.querySelectorAll(".card")[this.position]);
        }

        applyBannerGeometry(card) {
            if (this.getAttribute("artwork") !== "banner" || !card) {
                return;
            }
            const width = Number(card.dataset.artworkWidth);
            const height = Number(card.dataset.artworkHeight);
            if (Number.isFinite(width) && width > 0 && Number.isFinite(height) && height > 0) {
                this.stage.style.setProperty("--banner-ratio", `${width} / ${height}`);
                this.style.maxWidth = `${width}px`;
            }
        }

        startRotation() {
            this.stopRotation();
            if (!this.isConnected
                || !this.payload?.rotate
                || this.payload.slides.length < 2
                || document.hidden) {
                return;
            }
            const delay = Math.max(3000, Number(this.payload.rotateMs) || 8000);
            this.rotation = window.setInterval(() => this.goTo(this.position + 1), delay);
        }

        stopRotation() {
            if (this.rotation !== null) {
                window.clearInterval(this.rotation);
                this.rotation = null;
            }
        }

        imageUrl(id, imageType, maxWidth) {
            const path = `Items/${encodeURIComponent(id)}/Images/${imageType}/0`;
            if (!Number.isFinite(maxWidth)) {
                return this.api.getUrl(path);
            }
            return this.api.getUrl(path, {
                maxWidth: maxWidth,
                quality: 90
            });
        }

        detailsUrl(id) {
            const target = new URL(window.location.href);
            target.hash = `#/details?id=${encodeURIComponent(id)}`;
            return target.toString();
        }
    }

    customElements.define(componentName, PunisherBannaCarousel);

    const runtime = {
        host: null,
        carousel: null,
        loading: false,
        timer: null
    };

    function jellyfinApi() {
        return window.ApiClient || (typeof ApiClient !== "undefined" ? ApiClient : null);
    }

    function homeContainer() {
        return document.querySelector(".homeSectionsContainer, [data-testid='home-sections'], [class*='homeSectionsContainer']");
    }

    async function reconcile() {
        const host = homeContainer();
        if (!host) {
            runtime.carousel?.remove();
            runtime.carousel = null;
            runtime.host = null;
            return;
        }
        if (runtime.host === host && runtime.carousel?.isConnected) {
            return;
        }
        const api = jellyfinApi();
        if (!api || runtime.loading) {
            schedule();
            return;
        }

        runtime.loading = true;
        try {
            const response = await api.fetch({ url: api.getUrl("/PunisherBanna/content"), type: "GET" });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const payload = await response.json();
            runtime.carousel?.remove();
            runtime.carousel = null;
            runtime.host = null;
            if (!Array.isArray(payload.slides) || payload.slides.length === 0 || !host.isConnected) {
                return;
            }
            const carousel = document.createElement(componentName);
            carousel.configure(api, payload);
            host.prepend(carousel);
            runtime.host = host;
            runtime.carousel = carousel;
        } catch (error) {
            console.warn("PunisherBanna: Banner konnten nicht geladen werden.", error);
        } finally {
            runtime.loading = false;
        }
    }

    function schedule() {
        window.clearTimeout(runtime.timer);
        runtime.timer = window.setTimeout(reconcile, 140);
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            runtime.carousel?.stopRotation();
        } else {
            runtime.carousel?.startRotation();
        }
    });
    window.addEventListener("hashchange", schedule);
    window.addEventListener("popstate", schedule);

    const observer = new MutationObserver(schedule);
    function start() {
        if (!document.body) {
            window.setTimeout(start, 100);
            return;
        }
        observer.observe(document.body, { childList: true, subtree: true });
        schedule();
    }

    window.__punisherBannaV2 = { observer: observer };
    start();
}());
