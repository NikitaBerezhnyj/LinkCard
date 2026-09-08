using FluentValidation;
using LinkCard.DTOs.Users.Requests;
using LinkCard.Validation.Common;

namespace LinkCard.Validation.Users;

public class UpdateBackgroundValueRequestValidator : AbstractValidator<UpdateBackgroundValueRequest>
{
    public UpdateBackgroundValueRequestValidator()
    {
        When(x => x.Color is not null, () => RuleFor(x => x.Color!).IsHexColor());
        When(x => x.Position is not null, () => RuleFor(x => x.Position!.Value).IsInEnum());
        When(x => x.Size is not null, () => RuleFor(x => x.Size!.Value).IsInEnum());
        When(x => x.Repeat is not null, () => RuleFor(x => x.Repeat!.Value).IsInEnum());

        RuleFor(x => x.Gradient!)
            .SetValidator(new UpdateGradientRequestValidator())
            .When(x => x.Gradient is not null);
    }
}