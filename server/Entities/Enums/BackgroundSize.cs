using System.Text.Json.Serialization;

namespace LinkCard.Entities.Enums;

public enum BackgroundSize
{
    [JsonStringEnumMemberName("cover")] Cover,
    [JsonStringEnumMemberName("contain")] Contain,
    [JsonStringEnumMemberName("auto")] Auto
}