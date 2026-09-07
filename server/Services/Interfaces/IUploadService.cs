using LinkCard.DTOs.Media;

namespace LinkCard.Services.Interfaces;

public interface IUploadService
{
    Task<AvatarUploadResponse> UploadAvatarAsync(Guid userId, IFormFile file, CancellationToken ct = default);
    Task<BackgroundUploadResponse> UploadBackgroundAsync(Guid userId, IFormFile file, CancellationToken ct = default);
}