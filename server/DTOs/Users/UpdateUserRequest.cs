using LinkCard.Entities;

namespace LinkCard.DTOs.Users;

public class UpdateUserRequest
{
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? Bio { get; set; }
    public List<UserLinkDTO>? Links { get; set; }
    public UpdateStylesRequest? Styles { get; set; }
}

public class UserLinkDTO
{
    public string Title { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}

public class UpdateStylesRequest
{
    public UpdateTypographyRequest? Typography { get; set; }
    public UpdateColorSchemeRequest? Colors { get; set; }
    public UpdateLayoutRequest? Layout { get; set; }
    public UpdateBackgroundRequest? Background { get; set; }
}

public class UpdateTypographyRequest
{
    public string? Font { get; set; }
    public string? FontSize { get; set; }
    public string? FontWeight { get; set; }
    public TextAlign? TextAlign { get; set; }
}

public class UpdateColorSchemeRequest
{
    public string? Text { get; set; }
    public string? LinkText { get; set; }
    public string? Border { get; set; }
    public string? ContentBackground { get; set; }
    public UpdateButtonColorsRequest? Button { get; set; }
}

public class UpdateButtonColorsRequest
{
    public string? Text { get; set; }
    public string? Background { get; set; }
    public string? HoverText { get; set; }
    public string? HoverBackground { get; set; }
}

public class UpdateLayoutRequest
{
    public string? BorderRadius { get; set; }
    public string? ContentPadding { get; set; }
    public string? ContentGap { get; set; }
}

public class UpdateBackgroundRequest
{
    public BackgroundType? Type { get; set; }
    public UpdateBackgroundValueRequest? Value { get; set; }
}

public class UpdateBackgroundValueRequest
{
    public string? Color { get; set; }
    public UpdateGradientRequest? Gradient { get; set; }
    public string? Position { get; set; }
    public string? Size { get; set; }
    public string? Repeat { get; set; }
}

public class UpdateGradientRequest
{
    public string? Start { get; set; }
    public string? End { get; set; }
    public string? Angle { get; set; }
}