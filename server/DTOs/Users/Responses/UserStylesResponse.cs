namespace LinkCard.DTOs.Users.Responses;

public class UserStylesResponse
{
    public TypographyResponse Typography { get; set; } = new();
    public ColorSchemeResponse Colors { get; set; } = new();
    public LayoutResponse Layout { get; set; } = new();
    public BackgroundResponse Background { get; set; } = new();
}