using MediaBrowser.Model.Plugins;

namespace PunisherBanna.Configuration;

public sealed class Settings : BasePluginConfiguration
{
    public string SourceLibrary { get; set; } = string.Empty;

    public int VisibleSlides { get; set; } = 5;

    public bool RatingsVisible { get; set; } = true;

    public bool AutomaticRotation { get; set; } = true;

    public int RotationSeconds { get; set; } = 8;

    public string DisplaySize { get; set; } = "standard";

    public bool FullBackdrop { get; set; }

    public string VerticalFocus { get; set; } = "center";

    public bool ArrowButtons { get; set; }

    public bool PageIndicators { get; set; } = true;

    public void Sanitize()
    {
        SourceLibrary = Guid.TryParse(SourceLibrary, out Guid libraryId)
            ? libraryId.ToString("D")
            : string.Empty;
        VisibleSlides = Math.Clamp(VisibleSlides, 1, 20);
        RotationSeconds = Math.Clamp(RotationSeconds, 3, 60);
        DisplaySize = DisplaySize?.Trim().ToLowerInvariant() switch
        {
            "small" => "small",
            "large" => "large",
            _ => "standard"
        };
        VerticalFocus = VerticalFocus?.Trim().ToLowerInvariant() switch
        {
            "top" => "top",
            "bottom" => "bottom",
            _ => "center"
        };
    }
}
