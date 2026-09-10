# PunisherBanna

PunisherBanna adds a customizable banner carousel with random movies or TV shows to the Jellyfin home screen.

## Features

- Select a single media library
- Display between 1 and 20 random movies or TV shows
- Use `backdrop.jpg` artwork
- Optionally show the complete, uncropped backdrop in its original aspect ratio on desktop
- Keep the established cropped, banner-filling backdrop presentation as the default
- Show the media logo or title text
- Optionally display the community rating
- Small, standard, and large size presets
- Adjustable vertical image position
- Optional automatic slide rotation
- Optional navigation arrows and pagination dots
- Swipe on mobile devices, drag with a mouse, or use keyboard navigation
- Open the Jellyfin item details page by selecting a banner

## Requirements

- Jellyfin Server 12.0.x
- [File Transformation 3.0.0.0](https://github.com/IAmParadox27/jellyfin-plugin-file-transformation/releases/tag/3.0.0.0)

## Installation

Add the following repository URL under **Dashboard → Plugins → Repositories**:

```text
https://raw.githubusercontent.com/PunikaSama/PunisherBanna/main/manifest.json
```

Install PunisherBanna, select a library in the plugin settings, and then restart Jellyfin completely.

When upgrading from an older PunisherBanna build, install version `2.0.0.0` or newer and select the library again. Jellyfin may otherwise keep loading an older, higher-numbered `1.x` build.

## License

PunisherBanna is licensed under the MIT License. Copyright © 2026 PunisherSama.

## Clients

The plugin works in the Jellyfin web client and in applications that embed the web client. Fully native client interfaces are not modified.
