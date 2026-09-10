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

if (html.includes("LibraryLoadStatus") || html.includes("wie bisher")) {
    throw new Error("Removed settings text was reintroduced.");
}

for (const required of [
    "customElements.define",
    "attachShadow",
    "pointerdown",
    "pointermove",
    "touch-action: pan-y",
    "/PunisherBanna/content",
    "#/details?id="
]) {
    if (!client.includes(required)) {
        throw new Error(`Missing webclient behavior: ${required}`);
    }
}
