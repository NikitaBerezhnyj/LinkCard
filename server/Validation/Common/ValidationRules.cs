using System.Text.RegularExpressions;
using FluentValidation;

namespace LinkCard.Validation.Common;

public static class ValidationRules
{
    private const string HexColorPattern = "^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$";
    private const string CssLengthPattern = @"^-?\d{1,4}(\.\d+)?(px|rem|em|%)$";
    private const string CssAnglePattern = @"^-?\d{1,3}(\.\d+)?deg$";
    private const string UsernamePattern = "^[a-zA-Z0-9_.-]{3,32}$";
    private static readonly string[] AllowedLinkSchemes =
        [Uri.UriSchemeHttp, Uri.UriSchemeHttps, Uri.UriSchemeMailto, "tel"];
    private static readonly Regex EmailLocalPartPattern =
        new(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.Compiled);
    private static readonly Regex PhoneNumberPattern =
        new(@"^\+?[0-9\-\s()]{6,20}$", RegexOptions.Compiled);

    public static IRuleBuilderOptions<T, string> IsHexColor<T>(this IRuleBuilder<T, string> rule) =>
        rule.Matches(HexColorPattern)
            .WithMessage("'{PropertyName}' must be a valid hex color (#rgb, #rrggbb or #rrggbbaa).");

    public static IRuleBuilderOptions<T, string> IsCssLength<T>(this IRuleBuilder<T, string> rule) =>
        rule.Matches(CssLengthPattern)
            .WithMessage("'{PropertyName}' must be a valid CSS length (e.g. 16px, 1.5rem, 100%).");

    public static IRuleBuilderOptions<T, string> IsCssAngle<T>(this IRuleBuilder<T, string> rule) =>
        rule.Matches(CssAnglePattern)
            .WithMessage("'{PropertyName}' must be a valid CSS angle (e.g. 135deg).");

    public static IRuleBuilderOptions<T, string> IsUsername<T>(this IRuleBuilder<T, string> rule) =>
        rule.Matches(UsernamePattern)
            .WithMessage("Username must be 3-32 characters: letters, digits, underscore, dot or hyphen.");

    public static IRuleBuilderOptions<T, string> IsLinkUrl<T>(this IRuleBuilder<T, string> rule) =>
        rule.Must(BeAValidLinkUrl)
            .WithMessage("'{PropertyName}' must be a valid http(s), mailto or tel link.");

    private static bool BeAValidLinkUrl(string url)
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
            return false;

        if (!AllowedLinkSchemes.Contains(uri.Scheme))
            return false;

        var opaquePart = url[(uri.Scheme.Length + 1)..];

        return uri.Scheme switch
        {
            "mailto" => EmailLocalPartPattern.IsMatch(opaquePart),
            "tel" => PhoneNumberPattern.IsMatch(opaquePart),
            _ => true
        };
    }
}