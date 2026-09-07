namespace LinkCard.DTOs.Users.Responses;

public class UserResponse
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public string? Bio { get; set; }
    public DateTime CreatedAt { get; set; }

    public List<UserLinkResponse> Links { get; set; } = [];
    public UserStylesResponse Styles { get; set; } = new();
}