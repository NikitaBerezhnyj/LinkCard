using FluentValidation;
using LinkCard.DTOs.Users.Requests;

namespace LinkCard.Validation.Users;

public class UpdateBackgroundRequestValidator : AbstractValidator<UpdateBackgroundRequest>
{
    public UpdateBackgroundRequestValidator()
    {
        When(x => x.Type is not null, () => RuleFor(x => x.Type!.Value).IsInEnum());

        RuleFor(x => x.Value!)
            .SetValidator(new UpdateBackgroundValueRequestValidator())
            .When(x => x.Value is not null);
    }
}