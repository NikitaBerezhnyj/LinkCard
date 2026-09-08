using FluentValidation;
using LinkCard.DTOs.Users.Requests;
using LinkCard.Validation.Common;

namespace LinkCard.Validation.Users;

public class UpdateLinkRequestValidator : AbstractValidator<UpdateLinkRequest>
{
    public UpdateLinkRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.Url)
            .NotEmpty()
            .MaximumLength(2048)
            .IsHttpUrl();
    }
}