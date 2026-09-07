namespace LinkCard.DTOs.Users.Requests;

public class UpdateBackgroundValueRequest
{
    public string? Color { get; set; }
    public UpdateGradientRequest? Gradient { get; set; }
    public string? Position { get; set; }
    public string? Size { get; set; }
    public string? Repeat { get; set; }
}