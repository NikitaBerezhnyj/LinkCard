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
    public Typography Typography { get; set; } = new();
    public ColorScheme Colors { get; set; } = new();
    public Layout Layout { get; set; } = new();
    public BackgroundStyle Background { get; set; } = new();
}

public class Typography
{
    public string Font { get; set; } = "Piazzolla";
    public string FontSize { get; set; } = "16px";
    public FontWeight FontWeight { get; set; } = FontWeight.Normal;
    public TextAlign TextAlign { get; set; } = TextAlign.Center;
}

public class ColorScheme
{
    public string Text { get; set; } = "#22201b";
    public string LinkText { get; set; } = "#2c5f4a";
    public string Border { get; set; } = "#e4dcc9";
    public string ContentBackground { get; set; } = "#ffffff";
    public ButtonColors Button { get; set; } = new();
}

public class ButtonColors
{
    public string Text { get; set; } = "#ffffff";
    public string Background { get; set; } = "#2c5f4a";
    public string HoverText { get; set; } = "#ffffff";
    public string HoverBackground { get; set; } = "#1e4636";
}

public class Layout
{
    public string BorderRadius { get; set; } = "14px";
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
    public string Color { get; set; } = "#f6f1e6";
    public GradientStyle Gradient { get; set; } = new();
    public string ImageKey { get; set; } = string.Empty;
    public BackgroundPosition Position { get; set; } = BackgroundPosition.Center;
    public BackgroundSize Size { get; set; } = BackgroundSize.Cover;
    public BackgroundRepeat Repeat { get; set; } = BackgroundRepeat.NoRepeat;
}

public class GradientStyle
{
    public string Start { get; set; } = "#f6f1e6";
    public string End { get; set; } = "#e4dcc9";
    public string Angle { get; set; } = "135deg";
}