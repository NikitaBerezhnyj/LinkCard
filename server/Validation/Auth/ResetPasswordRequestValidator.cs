using FluentValidation;
using LinkCard.DTOs.Auth;

namespace LinkCard.Validation.Auth;

public class ResetPasswordRequestValidator : AbstractValidator<ResetPasswordRequest>
{
    public ResetPasswordRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.NewPassword).NotEmpty().MinimumLength(8);
    }
}