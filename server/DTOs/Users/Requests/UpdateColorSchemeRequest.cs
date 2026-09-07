namespace LinkCard.DTOs.Users.Requests;

public class UpdateColorSchemeRequest
{
    public string? Text { get; set; }
    public string? LinkText { get; set; }
    public string? Border { get; set; }
    public string? ContentBackground { get; set; }
    public UpdateButtonColorsRequest? Button { get; set; }
}