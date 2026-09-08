using FluentValidation;
using LinkCard.DTOs.Users.Requests;
using LinkCard.Validation.Common;

namespace LinkCard.Validation.Users;

public class UpdateButtonColorsRequestValidator : AbstractValidator<UpdateButtonColorsRequest>
{
    public UpdateButtonColorsRequestValidator()
    {
        When(x => x.Text is not null, () => RuleFor(x => x.Text!).IsHexColor());
        When(x => x.Background is not null, () => RuleFor(x => x.Background!).IsHexColor());
        When(x => x.HoverText is not null, () => RuleFor(x => x.HoverText!).IsHexColor());
        When(x => x.HoverBackground is not null, () => RuleFor(x => x.HoverBackground!).IsHexColor());
    }
}