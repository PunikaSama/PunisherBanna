using System.Text.Json.Serialization;

namespace PunisherBanna.Contracts;

public sealed class CarouselPayload
{
    [JsonPropertyName("slides")]
    public IReadOnlyList<SlideData> Slides { get; init; } = Array.Empty<SlideData>();

    [JsonPropertyName("rotate")]
    public bool Rotate { get; init; }

    [JsonPropertyName("rotateMs")]
    public int RotateMilliseconds { get; init; }

    [JsonPropertyName("rating")]
    public bool Rating { get; init; }

    [JsonPropertyName("size")]
    public required string Size { get; init; }

    [JsonPropertyName("mediaFit")]
    public required string MediaFit { get; init; }

    [JsonPropertyName("arrows")]
    public bool Arrows { get; init; }

    [JsonPropertyName("dots")]
    public bool Dots { get; init; }

    [JsonPropertyName("bannerPlaybackMode")]
    public required string BannerPlaybackMode { get; init; }

    [JsonPropertyName("enableVideoOnMobile")]
    public bool EnableVideoOnMobile { get; init; }

    [JsonPropertyName("audioEnabled")]
    public bool AudioEnabled { get; init; }

    [JsonPropertyName("audioVolumePercent")]
    public int AudioVolumePercent { get; init; }

    [JsonPropertyName("videoStartDelayMs")]
    public int VideoStartDelayMilliseconds { get; init; }

    [JsonPropertyName("videoClipDurationMs")]
    public int VideoClipDurationMilliseconds { get; init; }

    [JsonPropertyName("videoStartPercent")]
    public int VideoStartPercent { get; init; }

    [JsonPropertyName("videoQualityPreset")]
    public required string VideoQualityPreset { get; init; }

    [JsonPropertyName("videoEndBehavior")]
    public required string VideoEndBehavior { get; init; }

    [JsonPropertyName("notice")]
    public string? Notice { get; init; }
}
