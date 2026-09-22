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

    public async Task<List<UserSearchResponse>> SearchAsync(string? username)
    {
        var query = dbContext.Users
            .AsNoTracking()
            .Where(u => u.UserName != null);

        if (string.IsNullOrWhiteSpace(username))
        {
            return await query
                .OrderBy(_ => Guid.NewGuid())
                .Take(5)
                .Select(u => new UserSearchResponse
                {
                    Id = u.Id,
                    Username = u.UserName!,
                    Avatar = string.IsNullOrWhiteSpace(u.AvatarKey)
                        ? null
                        : mediaUrlService.GetUrl(u.AvatarKey)
                })
                .ToListAsync();
        }

        username = username.Trim();

        return await query
            .Where(u => EF.Functions.ILike(u.UserName!, $"%{username}%"))
            .OrderBy(u => u.UserName)
            .Take(5)
            .Select(u => new UserSearchResponse
            {
                Id = u.Id,
                Username = u.UserName!,
                Avatar = string.IsNullOrWhiteSpace(u.AvatarKey)
                    ? null
                    : mediaUrlService.GetUrl(u.AvatarKey)
            })
            .ToListAsync();
    }

    public async Task<UserResponse> GetMeAsync(Guid userId)
    {
        var user = await dbContext.Users
            .Include(u => u.Links.OrderBy(l => l.Order))
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId)
            ?? throw new NotFoundException("User not found.");

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
            SyncLinks(user, dbContext, request.Links);

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

    private static void SyncLinks(ApplicationUser user, AppDbContext dbContext, List<UpdateLinkRequest> incoming)
    {
        var existingById = user.Links.ToDictionary(l => l.Id);
        var incomingIds = incoming
            .Where(dto => dto.Id is not null)
            .Select(dto => dto.Id!.Value)
            .ToHashSet();

        var toRemove = user.Links.Where(l => !incomingIds.Contains(l.Id)).ToList();
        dbContext.UserLinks.RemoveRange(toRemove);

        for (var index = 0; index < incoming.Count; index++)
        {
            var dto = incoming[index];

            if (dto.Id is { } id && existingById.TryGetValue(id, out var existing))
            {
                existing.Title = dto.Title;
                existing.Url = dto.Url;
                existing.Order = index;
            }
            else
            {
                dbContext.UserLinks.Add(new UserLink
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    Title = dto.Title,
                    Url = dto.Url,
                    Order = index
                });
            }
        }
    }

    private static void ApplyStylesUpdate(UserStyles target, UpdateStylesRequest update)
    {
        if (update.Font is { } font) target.Font = font;
        if (update.AccentColor is { } accentColor) target.AccentColor = accentColor;

        if (update.Background is { } background)
            ApplyBackgroundUpdate(target.Background, background);
    }

    private static void ApplyBackgroundUpdate(BackgroundStyle target, UpdateBackgroundRequest update)
    {
        if (update.Type is { } type) target.Type = type;
        if (update.Color is { } color) target.Color = color;
    }
}