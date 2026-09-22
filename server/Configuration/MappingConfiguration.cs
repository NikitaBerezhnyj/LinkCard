using LinkCard.DTOs.Users.Responses;
using LinkCard.Entities;
using Mapster;

namespace LinkCard.Configuration;

public static class MappingConfiguration
{
    public static void Register(TypeAdapterConfig config)
    {
        config.Default.IgnoreNullValues(true);

        config.NewConfig<ApplicationUser, UserResponse>()
            .Map(dest => dest.Username, src => src.UserName);

        config.NewConfig<UserLink, UserLinkResponse>();

        config.NewConfig<UserStyles, UserStylesResponse>();

        config.NewConfig<BackgroundStyle, BackgroundResponse>();
    }
}
