using MediaBrowser.Model.Plugins;

namespace PunisherBanna.Configuration;

public sealed class Settings : BasePluginConfiguration
{
    public string SettingsLanguage { get; set; } = "en";

    public string SourceLibrary { get; set; } = string.Empty;

    public int VisibleSlides { get; set; } = 5;

    public bool RatingsVisible { get; set; } = true;

    public bool AutomaticRotation { get; set; } = true;

    public int RotationSeconds { get; set; } = 8;

    public string DisplaySize { get; set; } = "standard";

    public string MediaFit { get; set; } = "cover";

    public bool CustomBannerWidth { get; set; }

    public int BannerWidthPercent { get; set; } = 90;

    public bool ArrowButtons { get; set; }

    public bool PageIndicators { get; set; } = true;

    public string BannerPlaybackMode { get; set; } = "image";

    public bool EnableVideoOnMobile { get; set; }

    public bool BannerAudioEnabled { get; set; }

    public int BannerAudioVolumePercent { get; set; } = 20;

    public int VideoStartDelayMilliseconds { get; set; } = 800;

    public int VideoClipDurationSeconds { get; set; } = 12;

    public int VideoStartPercent { get; set; } = 8;

    public string VideoQualityPreset { get; set; } = "balanced";

    public string VideoEndBehavior { get; set; } = "image";

    public void Sanitize()
    {
        SettingsLanguage = string.Equals(SettingsLanguage?.Trim(), "de", StringComparison.OrdinalIgnoreCase)
            ? "de"
            : "en";
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
        MediaFit = string.Equals(MediaFit?.Trim(), "contain", StringComparison.OrdinalIgnoreCase)
            ? "contain"
            : "cover";
        BannerWidthPercent = Math.Clamp(BannerWidthPercent, 45, 100);
        BannerPlaybackMode = BannerPlaybackMode?.Trim().ToLowerInvariant() switch
        {
            "local-trailer" => "local-trailer",
            "media-preview" => "media-preview",
            "automatic" => "automatic",
            _ => "image"
        };
        VideoStartDelayMilliseconds = Math.Clamp(VideoStartDelayMilliseconds, 0, 5000);
        BannerAudioVolumePercent = Math.Clamp(BannerAudioVolumePercent, 0, 100);
        VideoClipDurationSeconds = Math.Clamp(VideoClipDurationSeconds, 5, 30);
        VideoStartPercent = Math.Clamp(VideoStartPercent, 0, 50);
        VideoQualityPreset = VideoQualityPreset?.Trim().ToLowerInvariant() switch
        {
            "economy" => "economy",
            "high" => "high",
            _ => "balanced"
        };
        VideoEndBehavior = string.Equals(VideoEndBehavior?.Trim(), "loop", StringComparison.OrdinalIgnoreCase)
            ? "loop"
            : "image";
    }
}
