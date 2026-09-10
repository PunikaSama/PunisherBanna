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

    [JsonPropertyName("fullBackdrop")]
    public bool FullBackdrop { get; init; }

    [JsonPropertyName("anchor")]
    public required string Anchor { get; init; }

    [JsonPropertyName("arrows")]
    public bool Arrows { get; init; }

    [JsonPropertyName("dots")]
    public bool Dots { get; init; }

    [JsonPropertyName("notice")]
    public string? Notice { get; init; }
}
