using Microsoft.AspNetCore.Identity;

namespace LinkCard.Entities;

public class ApplicationUser : IdentityUser<Guid>
{
    public string? AvatarKey { get; set; } = string.Empty;
    public string? Bio { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<UserLink> Links { get; set; } = [];
    public UserStyles Styles { get; set; } = new();
}

public class UserLink
{
    public string Title { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}

public enum TextAlign { Left, Center, Right }
public enum BackgroundType { Color, Gradient, Image }

public class UserStyles
{
    public Typography Typography { get; set; } = new();
    public ColorScheme Colors { get; set; } = new();
    public Layout Layout { get; set; } = new();
    public BackgroundStyle Background { get; set; } = new();
}

public class Typography
{
    public string Font { get; set; } = "Roboto";
    public string FontSize { get; set; } = "16px";
    public string FontWeight { get; set; } = "400";
    public TextAlign TextAlign { get; set; } = TextAlign.Center;
}

public class ColorScheme
{
    public string Text { get; set; } = "#f3f4f6";
    public string LinkText { get; set; } = "#60a5fa";
    public string Border { get; set; } = "#2c2c2c";
    public string ContentBackground { get; set; } = "#1e1e1e";
    public ButtonColors Button { get; set; } = new();
}

public class ButtonColors
{
    public string Text { get; set; } = "#f3f4f6";
    public string Background { get; set; } = "#181818";
    public string HoverText { get; set; } = "#f3f4f6";
    public string HoverBackground { get; set; } = "#60a5fa";
}

public class Layout
{
    public string BorderRadius { get; set; } = "10px";
    public string ContentPadding { get; set; } = "24px";
    public string ContentGap { get; set; } = "16px";
}

public class BackgroundStyle
{
    public BackgroundType Type { get; set; } = BackgroundType.Color;
    public BackgroundValue Value { get; set; } = new();
}

public class BackgroundValue
{
    public string Color { get; set; } = "#181818";
    public GradientStyle Gradient { get; set; } = new();
    public string ImageKey { get; set; } = string.Empty;
    public string Position { get; set; } = "center";
    public string Size { get; set; } = "cover";
    public string Repeat { get; set; } = "no-repeat";
}

public class GradientStyle
{
    public string Start { get; set; } = "#1e1e1e";
    public string End { get; set; } = "#181818";
    public string Angle { get; set; } = "135deg";
}