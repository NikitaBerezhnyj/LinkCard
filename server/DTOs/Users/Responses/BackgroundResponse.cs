using LinkCard.Entities.Enums;

namespace LinkCard.DTOs.Users.Responses;

public class BackgroundResponse
{
    public BackgroundType Type { get; set; }
    public string? Color { get; set; }
    public string? GradientColor { get; set; }
    public string? Image { get; set; }
}