using System.Text.Json.Serialization;

namespace PunisherBanna.Contracts;

public sealed class SlideData
{
    [JsonPropertyName("id")]
    public required string Id { get; init; }

    [JsonPropertyName("title")]
    public required string Title { get; init; }

    [JsonPropertyName("mediaKind")]
    public required string MediaKind { get; init; }

    [JsonPropertyName("artwork")]
    public required string Artwork { get; init; }

    [JsonPropertyName("logo")]
    public bool Logo { get; init; }

    [JsonPropertyName("score")]
    public double? Score { get; init; }
}
