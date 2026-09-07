using System.Security.Claims;
using LinkCard.Common.Exceptions;
using LinkCard.DTOs.Users.Responses;
using LinkCard.DTOs.Users.Requests;
using LinkCard.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LinkCard.Controllers;

[ApiController]
[Route("user")]
public class UserController(IUserService userService) : ControllerBase
{
    [HttpGet("{username}")]
    public async Task<ActionResult<UserResponse>> GetByUsername(string username)
    {
        var user = await userService.GetByUsernameAsync(username);
        return Ok(user);
    }

    [HttpPatch("me")]
    [Authorize]
    public async Task<ActionResult<UserResponse>> UpdateMe(UpdateUserRequest request)
    {
        var user = await userService.UpdateAsync(GetUserId(), request);
        return Ok(user);
    }

    [HttpDelete("me")]
    [Authorize]
    public async Task<IActionResult> DeleteMe()
    {
        await userService.DeleteAsync(GetUserId());
        return NoContent();
    }

    private Guid GetUserId()
    {
        var idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? throw new UnauthorizedException("Invalid token.");
        return Guid.Parse(idClaim);
    }
}