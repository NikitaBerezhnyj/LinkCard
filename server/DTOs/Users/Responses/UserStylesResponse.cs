namespace LinkCard.DTOs.Users.Responses;

public class UserStylesResponse
{
    public string Font { get; set; } = string.Empty;
    public string AccentColor { get; set; } = string.Empty;
    public BackgroundResponse Background { get; set; } = new();
}