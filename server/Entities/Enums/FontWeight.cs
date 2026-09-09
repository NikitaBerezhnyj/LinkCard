using System.Text.Json.Serialization;

namespace LinkCard.Entities.Enums;

public enum FontWeight
{
    [JsonStringEnumMemberName("100")] Thin = 100,
    [JsonStringEnumMemberName("200")] ExtraLight = 200,
    [JsonStringEnumMemberName("300")] Light = 300,
    [JsonStringEnumMemberName("400")] Normal = 400,
    [JsonStringEnumMemberName("500")] Medium = 500,
    [JsonStringEnumMemberName("600")] SemiBold = 600,
    [JsonStringEnumMemberName("700")] Bold = 700,
    [JsonStringEnumMemberName("800")] ExtraBold = 800,
    [JsonStringEnumMemberName("900")] Black = 900
}