namespace LinkCard.DTOs.Users.Responses;

public class CurrentUserResponse
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Avatar { get; set; }
}