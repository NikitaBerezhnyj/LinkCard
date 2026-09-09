using System.Text.Json.Serialization;

namespace LinkCard.Entities.Enums;

public enum BackgroundRepeat
{
    [JsonStringEnumMemberName("repeat")] Repeat,
    [JsonStringEnumMemberName("no-repeat")] NoRepeat,
    [JsonStringEnumMemberName("repeat-x")] RepeatX,
    [JsonStringEnumMemberName("repeat-y")] RepeatY
}