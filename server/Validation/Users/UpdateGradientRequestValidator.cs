using FluentValidation;
using LinkCard.DTOs.Users.Requests;
using LinkCard.Validation.Common;

namespace LinkCard.Validation.Users;

public class UpdateGradientRequestValidator : AbstractValidator<UpdateGradientRequest>
{
    public UpdateGradientRequestValidator()
    {
        When(x => x.Start is not null, () => RuleFor(x => x.Start!).IsHexColor());
        When(x => x.End is not null, () => RuleFor(x => x.End!).IsHexColor());
        When(x => x.Angle is not null, () => RuleFor(x => x.Angle!).IsCssAngle());
    }
}