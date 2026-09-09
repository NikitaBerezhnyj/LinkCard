using System.Text.Json.Serialization;

namespace LinkCard.Entities.Enums;

public enum TextAlign
{
    [JsonStringEnumMemberName("left")] Left,
    [JsonStringEnumMemberName("center")] Center,
    [JsonStringEnumMemberName("right")] Right
}