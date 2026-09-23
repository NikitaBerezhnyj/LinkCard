using FluentValidation;
using LinkCard.DTOs.Users.Requests;
using LinkCard.Validation.Common;

namespace LinkCard.Validation.Users;

public class UpdateBackgroundRequestValidator : AbstractValidator<UpdateBackgroundRequest>
{
    public UpdateBackgroundRequestValidator()
    {
        When(x => x.Type is not null, () =>
            RuleFor(x => x.Type!.Value).IsInEnum());

        When(x => x.Color is not null, () =>
            RuleFor(x => x.Color!).IsHexColor());

        When(x => x.GradientColor is not null, () =>
            RuleFor(x => x.GradientColor!).IsHexColor());
    }
}