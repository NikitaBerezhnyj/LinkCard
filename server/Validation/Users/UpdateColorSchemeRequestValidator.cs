using FluentValidation;
using LinkCard.DTOs.Users.Requests;
using LinkCard.Validation.Common;

namespace LinkCard.Validation.Users;

public class UpdateColorSchemeRequestValidator : AbstractValidator<UpdateColorSchemeRequest>
{
    public UpdateColorSchemeRequestValidator()
    {
        When(x => x.Text is not null, () => RuleFor(x => x.Text!).IsHexColor());
        When(x => x.LinkText is not null, () => RuleFor(x => x.LinkText!).IsHexColor());
        When(x => x.Border is not null, () => RuleFor(x => x.Border!).IsHexColor());
        When(x => x.ContentBackground is not null, () => RuleFor(x => x.ContentBackground!).IsHexColor());

        RuleFor(x => x.Button!)
            .SetValidator(new UpdateButtonColorsRequestValidator())
            .When(x => x.Button is not null);
    }
}