(function () {
    "use strict";

    const componentName = "punisher-banna-slider-v272";
    if (window.__punisherBannaV272 || customElements.get(componentName)) {
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
            object-position: center center;
            position: absolute;
            width: 100%;
        }
        .video-host {
            inset: 0;
            overflow: hidden;
            pointer-events: none;
            position: absolute;
        }
        .banner-video {
            height: 100%;
            inset: 0;
            object-fit: cover;
            object-position: center center;
            opacity: 0;
            pointer-events: none;
            position: absolute;
            transition: opacity 520ms ease;
            width: 100%;
        }
        .banner-video.visible { opacity: 1; }
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
            bottom: clamp(1.4rem, 2.3vw, 2.4rem);
            display: flex;
            font-size: clamp(.86rem, 1.25vw, 1.05rem);
            font-weight: 600;
            gap: .75rem;
            left: clamp(2rem, 5vw, 5rem);
            position: absolute;
            text-shadow: 0 .1rem .3rem #000;
            z-index: 2;
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
        .audio-toggle {
            align-items: center;
            background: rgba(0, 0, 0, .58);
            border: 1px solid rgba(255, 255, 255, .72);
            border-radius: 50%;
            bottom: .75rem;
            color: #fff;
            cursor: pointer;
            display: flex;
            font-size: 1.25rem;
            height: 2.75rem;
            justify-content: center;
            padding: 0;
            position: absolute;
            right: .75rem;
            transition: background 160ms ease, transform 160ms ease;
            width: 2.75rem;
            z-index: 4;
        }
        .audio-toggle:hover, .audio-toggle:focus-visible {
            background: rgba(0, 0, 0, .84);
            transform: scale(1.06);
        }
        .audio-toggle[hidden] { display: none; }
        @media (max-width: 600px) {
            .stage { height: var(--mobile-height); }
            .caption { bottom: 2.1rem; left: 1.35rem; max-width: 75%; }
            .facts { bottom: 1.5rem; left: 1.35rem; }
            .step { height: 2.35rem; width: 2.35rem; }
            .back { left: .35rem; }
            .forward { right: .35rem; }
        }
        @media (prefers-reduced-motion: reduce) {
            .card, .page { transition: none; }
            .video-host { display: none !important; }
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
            this.videoStartTimer = null;
            this.videoClipTimer = null;
            this.videoLoadTimer = null;
            this.videoGeneration = 0;
            this.videoLoading = false;
            this.videoAttemptKey = null;
            this.activeVideo = null;
            this.videoSourceCache = new Map();
            this.visibilityObserver = null;
            this.bannerVisible = true;
            this.audioButton = null;

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
            this.observeVisibility();
            this.scheduleVideo();
        }

        disconnectedCallback() {
            this.stopRotation();
            this.stopVideo(true);
            this.visibilityObserver?.disconnect();
        }

        configure(api, payload) {
            this.stopVideo(true);
            this.api = api;
            this.payload = payload;
            this.position = 0;
            this.videoSourceCache.clear();
            this.setAttribute("size", ["small", "standard", "large"].includes(payload.size) ? payload.size : "standard");
            this.renderCards();
            this.bindStageEvents();
            this.startRotation();
            this.scheduleVideo();
        }

        renderCards() {
            this.stage.replaceChildren();
            this.audioButton = null;
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

            if (this.payload.audioEnabled === true && this.playbackMode() !== "image") {
                this.audioButton = this.makeAudioButton();
                this.setAudioMuted(this.storedAudioMuted(), false);
                this.stage.appendChild(this.audioButton);
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

            const artwork = document.createElement("img");
            artwork.className = "artwork";
            artwork.alt = "";
            artwork.draggable = false;
            artwork.loading = index === 0 ? "eager" : "lazy";
            artwork.src = this.imageUrl(slide.id, slide.artwork, 1920);
            card.appendChild(artwork);

            const shade = document.createElement("div");
            shade.className = "shade";
            card.appendChild(shade);

            const caption = document.createElement("div");
            caption.className = "caption";
            if (slide.logo) {
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
            card.appendChild(caption);

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
            card.appendChild(facts);
            return card;
        }

        playbackMode() {
            const mode = this.payload?.bannerPlaybackMode;
            return ["local-trailer", "media-preview", "automatic"].includes(mode) ? mode : "image";
        }

        mobileLayout() {
            return document.documentElement.classList.contains("layout-mobile")
                || window.matchMedia("(max-width: 600px)").matches;
        }

        videoAllowed() {
            const player = document.querySelector(".videoPlayerContainer-onTop");
            const playerVideo = Array.from(document.querySelectorAll(".videoPlayerContainer video"))
                .some(video => !video.paused && !video.ended);
            if (this.playbackMode() === "image"
                || !this.isConnected
                || !this.bannerVisible
                || document.hidden
                || window.matchMedia("(prefers-reduced-motion: reduce)").matches
                || navigator.connection?.saveData === true
                || player
                || playerVideo) {
                return false;
            }
            return !this.mobileLayout() || this.payload?.enableVideoOnMobile === true;
        }

        async getJson(path, parameters) {
            const response = await this.api.fetch({ url: this.api.getUrl(path, parameters), type: "GET" });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return response.json();
        }

        normalizePlayable(item, trailer) {
            const id = item?.Id || item?.id;
            return id ? {
                id: id,
                runTimeTicks: Number(item.RunTimeTicks ?? item.runTimeTicks) || 0,
                trailer: trailer
            } : null;
        }

        async localTrailer(slide) {
            try {
                const trailers = await this.getJson(`/Items/${encodeURIComponent(slide.id)}/LocalTrailers`, {
                    userId: this.api.getCurrentUserId?.()
                });
                return this.normalizePlayable((trailers || [])[0], true);
            } catch (error) {
                console.debug("PunisherBanna: Kein lokaler Trailer verfügbar.", error);
                return null;
            }
        }

        async mediaPreview(slide) {
            if (slide.mediaKind !== "series") {
                return this.normalizePlayable(slide, false);
            }
            const userId = this.api.getCurrentUserId?.();
            if (!userId) {
                return null;
            }
            try {
                const result = await this.getJson("/Items", {
                    UserId: userId,
                    ParentId: slide.id,
                    Recursive: true,
                    IncludeItemTypes: "Episode",
                    SortBy: "ParentIndexNumber,IndexNumber",
                    SortOrder: "Ascending",
                    Limit: 12,
                    Fields: "RunTimeTicks",
                    EnableImages: false,
                    EnableTotalRecordCount: false
                });
                const episodes = result.Items || result.items || [];
                const episode = episodes.find(item => Number(item.ParentIndexNumber ?? item.parentIndexNumber) > 0)
                    || episodes[0];
                return this.normalizePlayable(episode, false);
            } catch (error) {
                console.debug("PunisherBanna: Keine Episode für den Bannerausschnitt gefunden.", error);
                return null;
            }
        }

        resolveVideo(slide) {
            const mode = this.playbackMode();
            const key = `${mode}:${slide.id}`;
            if (this.videoSourceCache.has(key)) {
                return this.videoSourceCache.get(key);
            }
            let request;
            if (mode === "local-trailer") {
                request = this.localTrailer(slide);
            } else if (mode === "media-preview") {
                request = this.mediaPreview(slide);
            } else if (mode === "automatic") {
                request = this.localTrailer(slide).then(trailer => trailer || this.mediaPreview(slide));
            } else {
                request = Promise.resolve(null);
            }
            request = request.catch(error => {
                console.debug("PunisherBanna: Videoquelle konnte nicht aufgelöst werden.", error);
                return null;
            });
            this.videoSourceCache.set(key, request);
            return request;
        }

        videoQuality() {
            const presets = {
                economy: { width: 640, height: 360, bitrate: 800000 },
                balanced: { width: 960, height: 540, bitrate: 1500000 },
                high: { width: 1280, height: 720, bitrate: 3000000 }
            };
            let preset = Object.prototype.hasOwnProperty.call(presets, this.payload?.videoQualityPreset)
                ? this.payload.videoQualityPreset
                : "balanced";
            if (this.mobileLayout() && preset === "high") {
                preset = "balanced";
            }
            return presets[preset];
        }

        videoStartTicks(source) {
            if (source.trailer || source.runTimeTicks <= 0) {
                return 0;
            }
            const percent = Math.max(0, Math.min(50, Number(this.payload?.videoStartPercent) || 0));
            const wanted = source.runTimeTicks * percent / 100;
            const clipTicks = Math.max(5000, Math.min(30000, Number(this.payload?.videoClipDurationMs) || 12000)) * 10000;
            return Math.floor(Math.max(0, Math.min(wanted, source.runTimeTicks - clipTicks)));
        }

        videoUrl(source) {
            const quality = this.videoQuality();
            const token = typeof this.api.accessToken === "function" ? this.api.accessToken() : this.api.accessToken;
            const parameters = {
                Static: false,
                VideoCodec: "h264",
                AudioCodec: "aac",
                VideoBitrate: quality.bitrate,
                AudioBitrate: 64000,
                MaxAudioChannels: 2,
                Width: quality.width,
                Height: quality.height,
                StartTimeTicks: this.videoStartTicks(source),
                SubtitleStreamIndex: -1,
                EnableAutoStreamCopy: false,
                AllowVideoStreamCopy: false,
                AllowAudioStreamCopy: false
            };
            if (token) {
                parameters.ApiKey = token;
            }
            return this.api.getUrl(`/Videos/${encodeURIComponent(source.id)}/stream.mp4`, parameters);
        }

        releaseVideo(video) {
            if (!video) {
                return;
            }
            try {
                video.pause();
                video.removeAttribute("src");
                video.load();
            } catch (error) {
                console.debug("PunisherBanna: Videostream konnte nicht vollständig beendet werden.", error);
            }
            video.closest(".video-host")?.remove();
        }

        stopVideo(allowRetry) {
            this.videoGeneration += 1;
            window.clearTimeout(this.videoStartTimer);
            window.clearTimeout(this.videoClipTimer);
            window.clearTimeout(this.videoLoadTimer);
            this.videoStartTimer = null;
            this.videoClipTimer = null;
            this.videoLoadTimer = null;
            this.videoLoading = false;
            const video = this.activeVideo;
            this.activeVideo = null;
            if (this.audioButton) {
                this.audioButton.hidden = true;
            }
            if (allowRetry) {
                this.videoAttemptKey = null;
            }
            this.releaseVideo(video);
        }

        endVideoClip(video, generation) {
            if (generation !== this.videoGeneration || this.activeVideo !== video) {
                return;
            }
            window.clearTimeout(this.videoClipTimer);
            this.videoClipTimer = null;
            if (this.payload?.videoEndBehavior === "loop") {
                video.currentTime = 0;
                video.play().catch(() => this.stopVideo(false));
                this.videoClipTimer = window.setTimeout(
                    () => this.endVideoClip(video, generation),
                    Math.max(5000, Math.min(30000, Number(this.payload?.videoClipDurationMs) || 12000))
                );
                return;
            }
            video.classList.remove("visible");
            if (this.audioButton) {
                this.audioButton.hidden = true;
            }
            this.videoLoadTimer = window.setTimeout(() => {
                if (this.activeVideo === video) {
                    this.activeVideo = null;
                }
                this.releaseVideo(video);
            }, 540);
        }

        async startVideo(generation, slide, card) {
            const source = await this.resolveVideo(slide);
            if (generation !== this.videoGeneration) {
                return;
            }
            if (!this.videoAllowed() || this.payload.slides[this.position]?.id !== slide.id || !card.isConnected) {
                this.videoLoading = false;
                this.videoAttemptKey = null;
                return;
            }
            if (!source) {
                this.videoLoading = false;
                return;
            }
            const host = document.createElement("div");
            host.className = "video-host";
            host.setAttribute("aria-hidden", "true");
            const video = document.createElement("video");
            video.className = "banner-video";
            video.autoplay = true;
            video.controls = false;
            video.defaultMuted = true;
            video.muted = true;
            video.volume = this.configuredAudioVolume();
            video.playsInline = true;
            video.preload = "metadata";
            video.disablePictureInPicture = true;
            video.setAttribute("muted", "");
            video.setAttribute("playsinline", "");
            host.appendChild(video);
            card.insertBefore(host, card.querySelector(".shade"));
            this.activeVideo = video;
            this.videoLoading = false;
            video.addEventListener("playing", () => {
                if (generation !== this.videoGeneration || this.activeVideo !== video) {
                    return;
                }
                window.clearTimeout(this.videoLoadTimer);
                this.videoLoadTimer = null;
                video.classList.add("visible");
                if (this.audioButton && this.payload?.audioEnabled === true) {
                    this.audioButton.hidden = false;
                    this.setAudioMuted(this.storedAudioMuted(), false);
                }
                this.videoClipTimer = window.setTimeout(
                    () => this.endVideoClip(video, generation),
                    Math.max(5000, Math.min(30000, Number(this.payload?.videoClipDurationMs) || 12000))
                );
            }, { once: true });
            video.addEventListener("error", () => {
                if (this.activeVideo === video) {
                    this.stopVideo(false);
                }
            }, { once: true });
            video.addEventListener("ended", () => this.endVideoClip(video, generation), { once: true });
            this.videoLoadTimer = window.setTimeout(() => {
                if (this.activeVideo === video && !video.classList.contains("visible")) {
                    this.stopVideo(false);
                }
            }, 12000);
            video.src = this.videoUrl(source);
            video.load();
            try {
                await video.play();
            } catch (error) {
                if (this.activeVideo === video) {
                    console.debug("PunisherBanna: Browser hat das stumme Bannervideo abgelehnt.", error);
                    this.stopVideo(false);
                }
            }
        }

        scheduleVideo() {
            if (!this.videoAllowed() || this.activeVideo || this.videoLoading || this.videoStartTimer !== null) {
                return;
            }
            const slide = this.payload?.slides[this.position];
            const card = this.stage.querySelectorAll(".card")[this.position];
            if (!slide || !card) {
                return;
            }
            const key = `${this.position}:${slide.id}`;
            if (this.videoAttemptKey === key) {
                return;
            }
            this.videoAttemptKey = key;
            this.videoLoading = true;
            const generation = this.videoGeneration;
            const delay = Math.max(0, Math.min(5000, Number(this.payload?.videoStartDelayMs) || 0));
            this.videoStartTimer = window.setTimeout(() => {
                this.videoStartTimer = null;
                void this.startVideo(generation, slide, card);
            }, delay);
        }

        syncVideoEnvironment() {
            if (!this.videoAllowed()) {
                if (this.activeVideo || this.videoLoading || this.videoStartTimer !== null) {
                    this.stopVideo(true);
                }
                return;
            }
            this.scheduleVideo();
        }

        observeVisibility() {
            this.visibilityObserver?.disconnect();
            this.bannerVisible = true;
            if (typeof IntersectionObserver !== "function") {
                return;
            }
            this.visibilityObserver = new IntersectionObserver(entries => {
                const entry = entries[0];
                this.bannerVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= .2);
                if (this.bannerVisible) {
                    this.scheduleVideo();
                } else {
                    this.stopVideo(true);
                }
            }, { threshold: [0, .2] });
            this.visibilityObserver.observe(this);
        }

        audioPreferenceKey() {
            const user = this.api?.getCurrentUserId?.() || "anonymous";
            const serverValue = typeof this.api?.serverId === "function" ? this.api.serverId() : this.api?.serverId;
            const server = serverValue || window.location.origin;
            return `punisherBanna:audioMuted:${encodeURIComponent(String(server))}:${encodeURIComponent(String(user))}`;
        }

        storedAudioMuted() {
            if (this.payload?.audioEnabled !== true) {
                return true;
            }
            try {
                return window.localStorage.getItem(this.audioPreferenceKey()) !== "false";
            } catch (error) {
                console.debug("PunisherBanna: Ton-Einstellung konnte nicht gelesen werden.", error);
                return true;
            }
        }

        configuredAudioVolume() {
            const percent = Number(this.payload?.audioVolumePercent);
            const normalized = Number.isFinite(percent) ? Math.max(0, Math.min(100, percent)) : 20;
            return normalized / 100;
        }

        setAudioMuted(muted, persist) {
            const normalized = muted !== false;
            if (this.activeVideo) {
                this.activeVideo.volume = this.configuredAudioVolume();
                this.activeVideo.muted = normalized;
                this.activeVideo.defaultMuted = normalized;
            }
            if (this.audioButton) {
                this.audioButton.textContent = normalized ? "🔇" : "🔊";
                this.audioButton.setAttribute("aria-label", normalized ? "Bannerton einschalten" : "Bannerton stummschalten");
                this.audioButton.title = normalized ? "Ton einschalten" : "Stummschalten";
                this.audioButton.setAttribute("aria-pressed", normalized ? "false" : "true");
            }
            if (persist) {
                try {
                    window.localStorage.setItem(this.audioPreferenceKey(), normalized ? "true" : "false");
                } catch (error) {
                    console.debug("PunisherBanna: Ton-Einstellung konnte nicht gespeichert werden.", error);
                }
            }
        }

        makeAudioButton() {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "audio-toggle";
            button.hidden = true;
            button.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();
                this.setAudioMuted(!this.activeVideo || !this.activeVideo.muted, true);
            });
            return button;
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
                    return;
                }

                if (event.target.closest("button")) {
                    return;
                }

                const card = event.target.closest(".card.current");
                const slide = this.payload?.slides[this.position];
                if (card && slide) {
                    event.preventDefault();
                    this.openDetails(slide.id);
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
            const openOnRelease = !wasDragging
                && !cancelled
                && !event.ctrlKey
                && !event.metaKey
                && !event.shiftKey
                && !event.altKey;
            const slide = openOnRelease ? this.payload?.slides[this.position] : null;
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
            if (slide) {
                event.preventDefault();
                this.blockClick = true;
                window.clearTimeout(this.blockClickTimer);
                this.blockClickTimer = window.setTimeout(() => { this.blockClick = false; }, 400);
                this.openDetails(slide.id);
                return;
            }
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
            this.stopVideo(true);
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
            this.scheduleVideo();
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

        openDetails(id) {
            const target = new URL(this.detailsUrl(id));
            this.stopVideo(false);
            window.location.hash = target.hash;
        }
    }

    customElements.define(componentName, PunisherBannaCarousel);

    const runtime = {
        host: null,
        carousel: null,
        loading: false,
        timer: null,
        healthTimer: null
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
            runtime.carousel.syncVideoEnvironment();
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
            const carousel = new PunisherBannaCarousel();
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
        if (runtime.timer !== null) {
            return;
        }
        runtime.timer = window.setTimeout(() => {
            runtime.timer = null;
            void reconcile();
        }, 140);
    }

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            runtime.carousel?.stopRotation();
            runtime.carousel?.stopVideo(true);
        } else {
            runtime.carousel?.startRotation();
            runtime.carousel?.scheduleVideo();
            schedule();
        }
    });
    window.addEventListener("resize", () => runtime.carousel?.syncVideoEnvironment());
    window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener?.("change", () => runtime.carousel?.syncVideoEnvironment());
    navigator.connection?.addEventListener?.("change", () => runtime.carousel?.syncVideoEnvironment());
    window.addEventListener("hashchange", schedule);
    window.addEventListener("popstate", schedule);
    window.addEventListener("pageshow", schedule);
    document.addEventListener("viewshow", schedule);

    const observer = new MutationObserver(schedule);
    function start() {
        if (!document.body) {
            window.setTimeout(start, 100);
            return;
        }
        observer.observe(document.body, { childList: true, subtree: true });
        runtime.healthTimer = window.setInterval(schedule, 2000);
        schedule();
    }

    window.__punisherBannaV272 = { observer: observer, schedule: schedule };
    start();
}());
