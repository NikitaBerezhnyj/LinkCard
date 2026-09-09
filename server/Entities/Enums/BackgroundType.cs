using System.Text.Json.Serialization;

namespace LinkCard.Entities.Enums;

public enum BackgroundType
{
    [JsonStringEnumMemberName("color")] Color,
    [JsonStringEnumMemberName("gradient")] Gradient,
    [JsonStringEnumMemberName("image")] Image
}