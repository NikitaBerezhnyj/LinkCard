namespace LinkCard.DTOs.Users.Requests;

public class UpdateStylesRequest
{
    public string? Font { get; set; }
    public string? AccentColor { get; set; }
    public UpdateBackgroundRequest? Background { get; set; }
}