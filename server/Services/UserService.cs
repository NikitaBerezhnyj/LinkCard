using LinkCard.Common.Exceptions;
using LinkCard.DTOs.Users.Requests;
using LinkCard.DTOs.Users.Responses;
using LinkCard.Entities;
using LinkCard.Mappers;
using LinkCard.Services.Interfaces;
using Mapster;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LinkCard.Services;

public class UserService(
    UserManager<ApplicationUser> userManager,
    AppDbContext dbContext,
    IMediaUrlService mediaUrlService) : IUserService
{
    public async Task<UserResponse> GetByUsernameAsync(string username)
    {
        var user = await dbContext.Users
            .Include(u => u.Links.OrderBy(l => l.Order))
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.UserName == username)
            ?? throw new NotFoundException($"User '{username}' not found.");

        return user.ToResponse(mediaUrlService);
    }

    public async Task<UserResponse> UpdateAsync(Guid userId, UpdateUserRequest request)
    {
        var user = await dbContext.Users
            .Include(u => u.Links)
            .FirstOrDefaultAsync(u => u.Id == userId)
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
            await SyncLinks(user, request.Links);

        if (request.Styles is not null)
            ApplyStylesUpdate(user.Styles, request.Styles);

        await dbContext.SaveChangesAsync();

        return user.ToResponse(mediaUrlService);
    }

    public async Task DeleteAsync(Guid userId)
    {
        var user = await userManager.FindByIdAsync(userId.ToString())
            ?? throw new NotFoundException("User not found.");

        var result = await userManager.DeleteAsync(user);
        if (!result.Succeeded)
            throw new ValidationException(result.Errors.Select(e => e.Description));
    }

    private async Task SyncLinks(
    ApplicationUser user,
    List<UpdateLinkRequest> incoming)
    {
        dbContext.UserLinks.RemoveRange(user.Links);

        await dbContext.SaveChangesAsync();

        var newLinks = incoming.Select((dto, index) => new UserLink
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            Title = dto.Title,
            Url = dto.Url,
            Order = index
        });

        await dbContext.UserLinks.AddRangeAsync(newLinks);
    }

    private static void ApplyStylesUpdate(UserStyles target, UpdateStylesRequest update)
    {
        update.Typography?.Adapt(target.Typography);
        update.Colors?.Adapt(target.Colors);
        update.Layout?.Adapt(target.Layout);

        if (update.Background is { } background)
            ApplyBackgroundUpdate(target.Background, background);
    }

    private static void ApplyBackgroundUpdate(BackgroundStyle target, UpdateBackgroundRequest update)
    {
        if (update.Type is { } type)
            target.Type = type;

        if (update.Color is { } color)
            target.Value.Color = color;

        if (update.Gradient is not null)
            update.Gradient.Adapt(target.Value.Gradient);

        if (update.Position is { } position)
            target.Value.Position = position;

        if (update.Size is { } size)
            target.Value.Size = size;

        if (update.Repeat is { } repeat)
            target.Value.Repeat = repeat;
    }
}