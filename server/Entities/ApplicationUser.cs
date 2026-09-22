using Microsoft.AspNetCore.Identity;
using LinkCard.Entities.Enums;

namespace LinkCard.Entities;

public class ApplicationUser : IdentityUser<Guid>
{
    public string? AvatarKey { get; set; } = string.Empty;
    public string? Bio { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<UserLink> Links { get; set; } = [];
    public UserStyles Styles { get; set; } = new();
}

public class UserStyles
{
    public string Font { get; set; } = "Piazzolla, serif";
    public string AccentColor { get; set; } = "#2c5f4a";
    public BackgroundStyle Background { get; set; } = new();
}

public class BackgroundStyle
{
    public BackgroundType Type { get; set; } = BackgroundType.Color;
    public string? Color { get; set; }
    public string? ImageKey { get; set; }
}