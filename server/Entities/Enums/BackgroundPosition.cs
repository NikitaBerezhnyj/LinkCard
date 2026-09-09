using System.Text.Json.Serialization;

namespace LinkCard.Entities.Enums;

public enum BackgroundPosition
{
    [JsonStringEnumMemberName("center")] Center,
    [JsonStringEnumMemberName("top")] Top,
    [JsonStringEnumMemberName("bottom")] Bottom,
    [JsonStringEnumMemberName("left")] Left,
    [JsonStringEnumMemberName("right")] Right,
    [JsonStringEnumMemberName("top left")] TopLeft,
    [JsonStringEnumMemberName("top right")] TopRight,
    [JsonStringEnumMemberName("bottom left")] BottomLeft,
    [JsonStringEnumMemberName("bottom right")] BottomRight
}