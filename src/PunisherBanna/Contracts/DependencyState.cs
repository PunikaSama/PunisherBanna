using System.Text.Json.Serialization;

namespace PunisherBanna.Contracts;

public sealed class DependencyState
{
    [JsonPropertyName("version")]
    public required string Version { get; init; }

    [JsonPropertyName("connected")]
    public bool Connected { get; init; }

    [JsonPropertyName("message")]
    public required string Message { get; init; }
}
