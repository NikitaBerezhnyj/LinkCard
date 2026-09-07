using System.Security.Claims;
using LinkCard.Common.Exceptions;
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
            GetUserId(),
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
            GetUserId(),
            file,
            ct);

        return Ok(result);
    }

    private Guid GetUserId()
    {
        var idClaim = User.FindFirstValue(
            ClaimTypes.NameIdentifier);

        if (idClaim is null || !Guid.TryParse(idClaim, out var userId))
            throw new UnauthorizedException("Invalid token.");

        return userId;
    }
}