using LinkCard.Common.Extensions;
using LinkCard.DTOs.Media;
using LinkCard.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LinkCard.Controllers;

[ApiController]
[Route("users/me")]
[Authorize]
public class UserMediaController(
    IUploadService uploadService) : ControllerBase
{
    [HttpPut("avatar")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<ActionResult<AvatarUploadResponse>> UploadAvatar(
        IFormFile file,
        CancellationToken ct)
    {
        var result = await uploadService.UploadAvatarAsync(
            User.GetUserId(),
            file,
            ct);

        return Ok(result);
    }

    [HttpPut("background")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<ActionResult<BackgroundUploadResponse>> UploadBackground(
        IFormFile file,
        CancellationToken ct)
    {
        var result = await uploadService.UploadBackgroundAsync(
            User.GetUserId(),
            file,
            ct);

        return Ok(result);
    }
}