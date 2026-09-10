using System.Text.Json.Serialization;

namespace PunisherBanna.Contracts;

public sealed class LibraryChoice
{
    [JsonPropertyName("id")]
    public required string Id { get; init; }

    [JsonPropertyName("name")]
    public required string Name { get; init; }
}
