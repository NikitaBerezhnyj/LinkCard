namespace LinkCard.DTOs.Users.Responses;

public class ColorSchemeResponse
{
    public string? Text { get; set; }
    public string? LinkText { get; set; }
    public string? Border { get; set; }
    public string? ContentBackground { get; set; }
    public ButtonColorsResponse Button { get; set; } = new();
}