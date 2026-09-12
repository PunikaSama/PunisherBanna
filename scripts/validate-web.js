"use strict";

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const settingsPath = path.join(root, "src", "PunisherBanna", "Configuration", "settings.html");
const clientPath = path.join(root, "src", "PunisherBanna", "Web", "punisher-banna.js");
const html = fs.readFileSync(settingsPath, "utf8");
const client = fs.readFileSync(clientPath, "utf8");

const opening = "<script type=\"text/javascript\">";
const start = html.indexOf(opening);
const end = html.indexOf("</script>", start);
if (start < 0 || end < 0 || start > html.lastIndexOf("</div>")) {
    throw new Error("The settings script must be inside the Jellyfin page container.");
}

const settingsScript = html.slice(start + opening.length, end);
new Function(settingsScript);
new Function(client);

for (const required of [
    "SourceLibrary",
    "VisibleSlides",
    "DisplaySize",
    "FullBackdrop",
    "VerticalFocus",
    "ArrowButtons",
    "PageIndicators",
    "RatingsVisible",
    "AutomaticRotation",
    "RotationSeconds",
    "BannerPlaybackMode",
    "EnableVideoOnMobile",
    "BannerAudioEnabled",
    "BannerAudioVolumePercent",
    "updateAudioVolumeLabel",
    "VideoStartDelayMilliseconds",
    "VideoClipDurationSeconds",
    "VideoStartPercent",
    "VideoQualityPreset",
    "VideoEndBehavior",
    "resetVideoSettings",
    "/PunisherBanna/libraries",
    "ApiClient.getVirtualFolders()",
    "/UserViews"
]) {
    if (!settingsScript.includes(required)) {
        throw new Error(`Missing settings behavior: ${required}`);
    }
}

if (html.includes("LibraryLoadStatus") || html.includes("ArtworkKind") || html.includes("banner.jpg") || html.includes("wie bisher") || html.includes(">1.0.0.0<")) {
    throw new Error("Removed settings text was reintroduced.");
}

for (const required of ["PluginVersion", "state.version"]) {
    if (!settingsScript.includes(required) && !html.includes(required)) {
        throw new Error(`Missing dynamic version behavior: ${required}`);
    }
}

for (const required of [
    "customElements.define",
    "punisher-banna-slider-v260",
    "new PunisherBannaCarousel()",
    "attachShadow",
    "pointerdown",
    "pointermove",
    "touch-action: pan-y",
    "payload.fullBackdrop === true",
    "artwork.naturalWidth",
    "applyArtworkGeometry",
    "this.getAttribute(\"fit\") !== \"full\"",
    ":host([fit=\"full\"]) .artwork { object-fit: contain; }",
    "runtime.timer !== null",
    "window.setInterval(schedule, 2000)",
    "schedule: schedule",
    "/PunisherBanna/content",
    "#/details?id="
]) {
    if (!client.includes(required)) {
        throw new Error(`Missing webclient behavior: ${required}`);
    }
}

for (const required of [
    "/LocalTrailers",
    "media-preview",
    "automatic",
    "stream.mp4",
    "StartTimeTicks",
    "defaultMuted = true",
    "muted = true",
    "playsInline = true",
    "prefers-reduced-motion",
    "navigator.connection?.saveData",
    "IntersectionObserver",
    "videoPlayerContainer-onTop",
    "stopVideo(true)",
    "removeAttribute(\"src\")",
    "audioEnabled",
    "audioVolumePercent",
    "configuredAudioVolume",
    "localStorage",
    "audioPreferenceKey"
]) {
    if (!client.includes(required)) {
        throw new Error(`Missing safe banner-video behavior: ${required}`);
    }
}

if (!html.includes('value="image">Nur Bild (Standard)') || client.includes("youtube.com") || client.includes("youtu.be")) {
    throw new Error("Image mode must remain the default and external trailer services are not supported.");
}

if (html.includes('is="emby-slider"') || !html.includes('id="BannerAudioVolumeRow" style="margin:1.35em 0 1.85em"')) {
    throw new Error("The audio volume control must use the stable, separately spaced native range layout.");
}

if (client.includes("isBanner")
    || client.includes("artwork=\"banner\"")
    || client.includes("__punisherBannaV202")
    || client.includes("__punisherBannaV230")
    || client.includes("__punisherBannaV240")
    || client.includes("__punisherBannaV250")) {
    throw new Error("Removed banner.jpg behavior was reintroduced.");
}
