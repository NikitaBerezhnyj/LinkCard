using FluentValidation;
using LinkCard.DTOs.Auth;

namespace LinkCard.Validation.Auth;

public class ForgotPasswordRequestValidator : AbstractValidator<ForgotPasswordRequest>
{
    public ForgotPasswordRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
    }
}