using FluentValidation;
using LinkCard.DTOs.Users.Requests;
using LinkCard.Validation.Common;

namespace LinkCard.Validation.Users;

public class UpdateLayoutRequestValidator : AbstractValidator<UpdateLayoutRequest>
{
    public UpdateLayoutRequestValidator()
    {
        When(x => x.BorderRadius is not null, () => RuleFor(x => x.BorderRadius!).IsCssLength());
        When(x => x.ContentPadding is not null, () => RuleFor(x => x.ContentPadding!).IsCssLength());
        When(x => x.ContentGap is not null, () => RuleFor(x => x.ContentGap!).IsCssLength());
    }
}