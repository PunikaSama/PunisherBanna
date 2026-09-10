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
    "ArtworkKind",
    "VerticalFocus",
    "ArrowButtons",
    "PageIndicators",
    "RatingsVisible",
    "AutomaticRotation",
    "RotationSeconds",
    "/PunisherBanna/libraries",
    "ApiClient.getVirtualFolders()",
    "/UserViews"
]) {
    if (!settingsScript.includes(required)) {
        throw new Error(`Missing settings behavior: ${required}`);
    }
}

if (html.includes("LibraryLoadStatus") || html.includes("wie bisher") || html.includes(">1.0.0.0<")) {
    throw new Error("Removed settings text was reintroduced.");
}

for (const required of ["PluginVersion", "state.version"]) {
    if (!settingsScript.includes(required) && !html.includes(required)) {
        throw new Error(`Missing dynamic version behavior: ${required}`);
    }
}

for (const required of [
    "customElements.define",
    "punisher-banna-slider-v202",
    "new PunisherBannaCarousel()",
    "attachShadow",
    "pointerdown",
    "pointermove",
    "touch-action: pan-y",
    ":host([artwork=\"banner\"])",
    "isBanner ? null : 1920",
    "!isBanner && slide.logo",
    "artwork.naturalWidth",
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
