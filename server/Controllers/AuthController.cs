using LinkCard.DTOs.Auth;
using LinkCard.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace LinkCard.Controllers;

[ApiController]
[Route("auth")]
public class AuthController(
    IAuthService authService,
    IWebHostEnvironment env) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(
        RegisterRequest request)
    {
        var result = await authService.RegisterAsync(
            request,
            GetIpAddress());

        SetRefreshTokenCookie(
            result.RefreshToken,
            result.RefreshTokenExpiresAt);

        return CreatedAtAction(nameof(Register), result);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(
        LoginRequest request)
    {
        var result = await authService.LoginAsync(
            request,
            GetIpAddress());

        SetRefreshTokenCookie(
            result.RefreshToken,
            result.RefreshTokenExpiresAt);

        return Ok(result);
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<TokenResponse>> Refresh(
        [FromBody] RefreshRequest? request)
    {
        var token = request?.RefreshToken
            ?? Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(token))
            return Unauthorized(new
            {
                message = "Refresh token is missing."
            });

        var result = await authService.RefreshAsync(
            token,
            GetIpAddress());

        SetRefreshTokenCookie(
            result.RefreshToken,
            result.RefreshTokenExpiresAt);

        return Ok(result);
    }

    [HttpPost("password/forgot")]
    public async Task<IActionResult> ForgotPassword(
        ForgotPasswordRequest request)
    {
        await authService.ForgotPasswordAsync(request);

        return Ok();
    }

    [HttpPost("password/reset/{resetToken}")]
    public async Task<IActionResult> ResetPassword(
        string resetToken,
        ResetPasswordRequest request)
    {
        await authService.ResetPasswordAsync(
            resetToken,
            request);

        return Ok();
    }

    [HttpPost("logout")]
    public async Task<IActionResult> Logout(
        [FromBody] RefreshRequest? request)
    {
        var token = request?.RefreshToken
            ?? Request.Cookies["refreshToken"];

        if (!string.IsNullOrEmpty(token))
            await authService.LogoutAsync(token);

        Response.Cookies.Delete("refreshToken");

        return NoContent();
    }

    private void SetRefreshTokenCookie(
        string token,
        DateTime expiresAt)
    {
        Response.Cookies.Append("refreshToken", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = !env.IsDevelopment(),
            SameSite = SameSiteMode.Strict,
            Expires = expiresAt,
            Path = "/"
        });
    }

    private string? GetIpAddress() =>
        HttpContext.Connection.RemoteIpAddress?.ToString();
}