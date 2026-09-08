using LinkCard.Entities.Enums;

namespace LinkCard.DTOs.Users.Responses;

public class BackgroundValueResponse
{
    public string? Color { get; set; }
    public GradientResponse? Gradient { get; set; }
    public string? Image { get; set; }
    public BackgroundPosition? Position { get; set; }
    public BackgroundSize? Size { get; set; }
    public BackgroundRepeat? Repeat { get; set; }
}