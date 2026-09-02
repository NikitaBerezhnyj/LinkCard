using LinkCard.Entities;

namespace LinkCard.DTOs.Users;

public class UserDTO
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Avatar { get; set; }
    public string? Bio { get; set; }
    public DateTime CreatedAt { get; set; }
    public List<UserLink> Links { get; set; } = [];
    public UserStyles Styles { get; set; } = new();
}