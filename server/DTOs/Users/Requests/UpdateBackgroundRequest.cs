using LinkCard.Entities.Enums;

namespace LinkCard.DTOs.Users.Requests;

public class UpdateBackgroundRequest
{
    public BackgroundType? Type { get; set; }
    public string? Color { get; set; }
    public UpdateGradientRequest? Gradient { get; set; }
    public BackgroundPosition? Position { get; set; }
    public BackgroundSize? Size { get; set; }
    public BackgroundRepeat? Repeat { get; set; }
}