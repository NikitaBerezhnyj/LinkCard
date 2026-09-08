using FluentValidation;
using LinkCard.DTOs.Users.Requests;

namespace LinkCard.Validation.Users;

public class UpdateStylesRequestValidator : AbstractValidator<UpdateStylesRequest>
{
    public UpdateStylesRequestValidator()
    {
        RuleFor(x => x.Typography!)
            .SetValidator(new UpdateTypographyRequestValidator())
            .When(x => x.Typography is not null);

        RuleFor(x => x.Colors!)
            .SetValidator(new UpdateColorSchemeRequestValidator())
            .When(x => x.Colors is not null);

        RuleFor(x => x.Layout!)
            .SetValidator(new UpdateLayoutRequestValidator())
            .When(x => x.Layout is not null);

        RuleFor(x => x.Background!)
            .SetValidator(new UpdateBackgroundRequestValidator())
            .When(x => x.Background is not null);
    }
}