# PunisherBanna

PunisherBanna ergänzt die Jellyfin-Startseite um einen konfigurierbaren Banner-Slider mit zufälligen Filmen oder Serien.

## Funktionen

- Auswahl genau einer Bibliothek
- 1 bis 20 zufällige Filme oder Serien
- Bildquelle wahlweise `backdrop.jpg` oder `banner.jpg`
- Medienlogo oder Titel als Text
- optional sichtbare Community-Bewertung
- Größenprofile Klein, Standard und Groß
- einstellbare vertikale Bildposition
- optionales automatisches Wechseln
- optionale Navigationspfeile und Navigationspunkte
- Wischen auf Mobilgeräten, Ziehen mit der Maus und Tastaturnavigation
- Klick auf einen Banner öffnet die Jellyfin-Detailseite

## Voraussetzungen

- Jellyfin Server 12.0.x
- [File Transformation 3.0.0.0](https://github.com/IAmParadox27/jellyfin-plugin-file-transformation/releases/tag/3.0.0.0)

## Installation

Diese Repository-URL unter **Dashboard → Plugins → Repositories** hinzufügen:

```text
https://raw.githubusercontent.com/PunikaSama/PunisherBanna/main/manifest.json
```

Danach PunisherBanna installieren, eine Bibliothek auswählen und Jellyfin vollständig neu starten.

## Entwicklung

Benötigt wird das .NET-10-SDK.

```powershell
dotnet test .\PunisherBanna.slnx --configuration Release
.\build.ps1
```

## Lizenz

PunisherBanna steht unter der MIT-Lizenz. Copyright © 2026 PunisherSama.

## Clients

Die Erweiterung läuft im Jellyfin-Webclient und in Anwendungen, die diesen Webclient einbetten. Rein native Oberflächen werden nicht verändert.
