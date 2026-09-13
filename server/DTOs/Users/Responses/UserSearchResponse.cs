namespace LinkCard.DTOs.Users.Responses;

public class UserSearchResponse
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string? Avatar { get; set; }
}