using LinkCard.Common.Extensions;
using LinkCard.DTOs.Users.Requests;
using LinkCard.DTOs.Users.Responses;
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
        var user = await userService.UpdateAsync(
            User.GetUserId(),
            request);

        return Ok(user);
    }

    [HttpDelete("me")]
    [Authorize]
    public async Task<IActionResult> DeleteMe()
    {
        await userService.DeleteAsync(User.GetUserId());

        return NoContent();
    }
}