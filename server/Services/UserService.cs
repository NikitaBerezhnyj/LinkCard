using LinkCard.Common.Exceptions;
using LinkCard.DTOs.Users;
using LinkCard.Entities;
using LinkCard.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace LinkCard.Services;

public class UserService(UserManager<ApplicationUser> userManager) : IUserService
{
    public async Task<UserDTO> GetByUsernameAsync(string username)
    {
        var user = await userManager.FindByNameAsync(username)
            ?? throw new NotFoundException($"User '{username}' not found.");

        return MapToDTO(user);
    }

    public async Task<UserDTO> UpdateAsync(Guid userId, UpdateUserRequest request)
    {
        var user = await userManager.FindByIdAsync(userId.ToString())
            ?? throw new NotFoundException("User not found.");

        if (request.Username is { } newUsername && newUsername != user.UserName)
        {
            var result = await userManager.SetUserNameAsync(user, newUsername);
            if (!result.Succeeded)
                throw new ValidationException(result.Errors.Select(e => e.Description));
        }

        if (request.Email is { } newEmail && newEmail != user.Email)
        {
            var result = await userManager.SetEmailAsync(user, newEmail);
            if (!result.Succeeded)
                throw new ValidationException(result.Errors.Select(e => e.Description));
        }

        if (request.Bio is not null)
            user.Bio = request.Bio;

        if (request.Links is not null)
            user.Links = request.Links.Select(l => new UserLink { Title = l.Title, Url = l.Url }).ToList();

        if (request.Styles is not null)
            ApplyStylesUpdate(user.Styles, request.Styles);

        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
            throw new ValidationException(updateResult.Errors.Select(e => e.Description));

        return MapToDTO(user);
    }

    public async Task DeleteAsync(Guid userId)
    {
        var user = await userManager.FindByIdAsync(userId.ToString())
            ?? throw new NotFoundException("User not found.");

        var result = await userManager.DeleteAsync(user);
        if (!result.Succeeded)
            throw new ValidationException(result.Errors.Select(e => e.Description));
    }

    private static void ApplyStylesUpdate(UserStyles target, UpdateStylesRequest update)
    {
        if (update.Typography is { } typography)
        {
            if (typography.Font is not null) target.Typography.Font = typography.Font;
            if (typography.FontSize is not null) target.Typography.FontSize = typography.FontSize;
            if (typography.FontWeight is not null) target.Typography.FontWeight = typography.FontWeight;
            if (typography.TextAlign is not null) target.Typography.TextAlign = typography.TextAlign.Value;
        }

        if (update.Colors is { } colors)
        {
            if (colors.Text is not null) target.Colors.Text = colors.Text;
            if (colors.LinkText is not null) target.Colors.LinkText = colors.LinkText;
            if (colors.Border is not null) target.Colors.Border = colors.Border;
            if (colors.ContentBackground is not null) target.Colors.ContentBackground = colors.ContentBackground;

            if (colors.Button is { } button)
            {
                if (button.Text is not null) target.Colors.Button.Text = button.Text;
                if (button.Background is not null) target.Colors.Button.Background = button.Background;
                if (button.HoverText is not null) target.Colors.Button.HoverText = button.HoverText;
                if (button.HoverBackground is not null) target.Colors.Button.HoverBackground = button.HoverBackground;
            }
        }

        if (update.Layout is { } layout)
        {
            if (layout.BorderRadius is not null) target.Layout.BorderRadius = layout.BorderRadius;
            if (layout.ContentPadding is not null) target.Layout.ContentPadding = layout.ContentPadding;
            if (layout.ContentGap is not null) target.Layout.ContentGap = layout.ContentGap;
        }

        if (update.Background is { } background)
        {
            if (background.Type is not null) target.Background.Type = background.Type.Value;

            if (background.Value is { } value)
            {
                if (value.Color is not null) target.Background.Value.Color = value.Color;
                if (value.Image is not null) target.Background.Value.Image = value.Image;
                if (value.Position is not null) target.Background.Value.Position = value.Position;
                if (value.Size is not null) target.Background.Value.Size = value.Size;
                if (value.Repeat is not null) target.Background.Value.Repeat = value.Repeat;

                if (value.Gradient is { } gradient)
                {
                    if (gradient.Start is not null) target.Background.Value.Gradient.Start = gradient.Start;
                    if (gradient.End is not null) target.Background.Value.Gradient.End = gradient.End;
                    if (gradient.Angle is not null) target.Background.Value.Gradient.Angle = gradient.Angle;
                }
            }
        }
    }

    private static UserDTO MapToDTO(ApplicationUser user) => new()
    {
        Username = user.UserName!,
        Email = user.Email!,
        Avatar = user.Avatar,
        Bio = user.Bio,
        CreatedAt = user.CreatedAt,
        Links = user.Links,
        Styles = user.Styles
    };
}