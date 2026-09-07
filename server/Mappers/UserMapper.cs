using LinkCard.DTOs.Users.Responses;
using LinkCard.Entities;
using LinkCard.Services.Interfaces;
using Mapster;

namespace LinkCard.Mappers;

public static class UserMapper
{
    public static UserResponse ToResponse(
        this ApplicationUser user,
        IMediaUrlService mediaUrlService)
    {
        var response = user.Adapt<UserResponse>();

        response.Avatar = string.IsNullOrWhiteSpace(user.AvatarKey)
            ? null
            : mediaUrlService.GetUrl(user.AvatarKey);

        response.Styles.Background.Value.Image =
            string.IsNullOrWhiteSpace(user.Styles.Background.Value.ImageKey)
                ? null
                : mediaUrlService.GetUrl(user.Styles.Background.Value.ImageKey);

        return response;
    }
}