using FluentValidation;
using LinkCard.DTOs.Users.Requests;
using LinkCard.Validation.Common;

namespace LinkCard.Validation.Users;

public class UpdateTypographyRequestValidator : AbstractValidator<UpdateTypographyRequest>
{
    private static readonly string[] AllowedFonts = ["Roboto", "Inter", "Poppins", "Montserrat", "Open Sans"];

    public UpdateTypographyRequestValidator()
    {
        When(x => x.Font is not null, () =>
            RuleFor(x => x.Font!)
                .Must(f => AllowedFonts.Contains(f))
                .WithMessage($"Font must be one of: {string.Join(", ", AllowedFonts)}."));

        When(x => x.FontSize is not null, () =>
            RuleFor(x => x.FontSize!).IsCssLength());

        When(x => x.FontWeight is not null, () =>
            RuleFor(x => x.FontWeight!.Value).IsInEnum());

        When(x => x.TextAlign is not null, () =>
            RuleFor(x => x.TextAlign!.Value).IsInEnum());
    }
}