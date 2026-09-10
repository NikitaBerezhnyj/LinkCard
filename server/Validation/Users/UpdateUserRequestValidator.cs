using FluentValidation;
using LinkCard.DTOs.Users.Requests;
using LinkCard.Validation.Common;

namespace LinkCard.Validation.Users;

public class UpdateUserRequestValidator : AbstractValidator<UpdateUserRequest>
{
    private const int MaxLinksCount = 20;

    public UpdateUserRequestValidator()
    {
        When(x => x.Username is not null, () => RuleFor(x => x.Username!).IsUsername());
        When(x => x.Email is not null, () => RuleFor(x => x.Email!).EmailAddress());
        When(x => x.Bio is not null, () => RuleFor(x => x.Bio!).MaximumLength(500));

        When(x => x.Links is not null, () =>
        {
            RuleFor(x => x.Links!)
                .Must(links => links.Count <= MaxLinksCount)
                .WithMessage($"Maximum {MaxLinksCount} links allowed.");

            RuleFor(x => x.Links!)
                .Must(links => links.Where(l => l.Id is not null).Select(l => l.Id).Distinct().Count()
                    == links.Count(l => l.Id is not null))
                .WithMessage("Duplicate link ids are not allowed.");

            RuleForEach(x => x.Links!).SetValidator(new UpdateLinkRequestValidator());
        });

        RuleFor(x => x.Styles!)
            .SetValidator(new UpdateStylesRequestValidator())
            .When(x => x.Styles is not null);
    }
}