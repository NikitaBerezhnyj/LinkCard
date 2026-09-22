using FluentValidation;
using LinkCard.DTOs.Users.Requests;
using LinkCard.Validation.Common;

namespace LinkCard.Validation.Users;

public class UpdateStylesRequestValidator : AbstractValidator<UpdateStylesRequest>
{
    public UpdateStylesRequestValidator()
    {
        When(x => x.AccentColor is not null, () =>
            RuleFor(x => x.AccentColor!).IsHexColor());

        RuleFor(x => x.Background!)
            .SetValidator(new UpdateBackgroundRequestValidator())
            .When(x => x.Background is not null);
    }
}