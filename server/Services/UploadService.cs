using LinkCard.Common.Exceptions;
using LinkCard.DTOs.Media;
using LinkCard.Entities;
using LinkCard.Entities.Enums;
using LinkCard.Services.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace LinkCard.Services;

public class UploadService(
    IFileStorage fileStorage,
    IImageProcessor imageProcessor,
    IMediaUrlService mediaUrlService,
    UserManager<ApplicationUser> userManager) : IUploadService
{
    private static readonly HashSet<string> AllowedContentTypes = new(
        StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif"
    };

    private const long MaxFileSizeBytes = 10 * 1024 * 1024;

    public async Task<AvatarUploadResponse> UploadAvatarAsync(
        Guid userId,
        IFormFile file,
        CancellationToken ct = default)
    {
        var processed = await ProcessAndUploadAsync(
            userId,
            file,
            ImageKind.Avatar,
            "avatars",
            ct);

        var user = await GetUserAsync(userId);

        var previousKey = user.AvatarKey;

        user.AvatarKey = processed.Key;

        await SaveUserAsync(user);

        await DeletePreviousAsync(
            previousKey,
            processed.Key,
            ct);

        return new AvatarUploadResponse
        {
            AvatarUrl = mediaUrlService.GetUrl(processed.Key)
        };
    }

    public async Task<BackgroundUploadResponse> UploadBackgroundAsync(
        Guid userId,
        IFormFile file,
        CancellationToken ct = default)
    {
        var processed = await ProcessAndUploadAsync(
            userId,
            file,
            ImageKind.Background,
            "backgrounds",
            ct);

        var user = await GetUserAsync(userId);

        var previousKey = user.Styles.Background.Value.ImageKey;

        user.Styles.Background.Type = BackgroundType.Image;
        user.Styles.Background.Value.ImageKey = processed.Key;

        await SaveUserAsync(user);

        await DeletePreviousAsync(
            previousKey,
            processed.Key,
            ct);

        return new BackgroundUploadResponse
        {
            BackgroundUrl = mediaUrlService.GetUrl(processed.Key)
        };
    }

    private async Task<UploadedImage> ProcessAndUploadAsync(
        Guid userId,
        IFormFile file,
        ImageKind kind,
        string folder,
        CancellationToken ct)
    {
        ValidateFile(file);

        await using var input = file.OpenReadStream();

        var (processedStream, contentType, extension) =
            await imageProcessor.ProcessAsync(
                input,
                file.ContentType,
                kind,
                ct);

        await using (processedStream)
        {
            var key = $"{folder}/{userId}.{extension}";

            await fileStorage.UploadAsync(
                processedStream,
                key,
                contentType,
                ct);

            return new UploadedImage(key);
        }
    }

    private async Task DeletePreviousAsync(
        string? previousKey,
        string newKey,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(previousKey) ||
            previousKey == newKey)
        {
            return;
        }

        await fileStorage.DeleteAsync(previousKey, ct);
    }

    private static void ValidateFile(IFormFile file)
    {
        if (file.Length == 0)
            throw new BadRequestException("File is empty.");

        if (file.Length > MaxFileSizeBytes)
            throw new BadRequestException(
                "File exceeds the 10 MB size limit.");

        if (!AllowedContentTypes.Contains(file.ContentType))
            throw new BadRequestException(
                "Unsupported file type.");
    }

    private async Task<ApplicationUser> GetUserAsync(Guid userId)
    {
        return await userManager.FindByIdAsync(userId.ToString())
            ?? throw new NotFoundException("User not found.");
    }

    private async Task SaveUserAsync(ApplicationUser user)
    {
        var result = await userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            throw new ValidationException(
                result.Errors.Select(e => e.Description));
        }
    }

    private sealed record UploadedImage(string Key);
}