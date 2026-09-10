using System.Text.Json.Serialization;

namespace PunisherBanna.Contracts;

public sealed class DependencyState
{
    [JsonPropertyName("connected")]
    public bool Connected { get; init; }

    [JsonPropertyName("message")]
    public required string Message { get; init; }
}
