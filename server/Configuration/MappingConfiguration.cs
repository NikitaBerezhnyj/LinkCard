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

        config.NewConfig<Typography, TypographyResponse>()
            .Map(dest => dest.TextAlign, src => src.TextAlign.ToString());

        config.NewConfig<ColorScheme, ColorSchemeResponse>();

        config.NewConfig<ButtonColors, ButtonColorsResponse>();

        config.NewConfig<Layout, LayoutResponse>();

        config.NewConfig<BackgroundStyle, BackgroundResponse>();

        config.NewConfig<BackgroundValue, BackgroundValueResponse>()
            .Map(dest => dest.Image, src => src.ImageKey);

        config.NewConfig<GradientStyle, GradientResponse>();
    }
}