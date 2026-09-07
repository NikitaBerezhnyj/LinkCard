using LinkCard.Common.Exceptions;
using LinkCard.DTOs.Auth;
using LinkCard.Entities;
using LinkCard.Options;
using LinkCard.Mappers;
using LinkCard.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace LinkCard.Services;

public class AuthService(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    ITokenService tokenService,
    AppDbContext dbContext,
    JwtOptions jwtOptions,
    IMediaUrlService mediaUrlService) : IAuthService
{
    public async Task<AuthResponse> RegisterAsync(RegisterRequest request, string? ipAddress)
    {
        var user = new ApplicationUser
        {
            UserName = request.Username,
            Email = request.Email
        };

        var result = await userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            throw new ValidationException(result.Errors.Select(e => e.Description));

        var tokens = await IssueTokensAsync(user, ipAddress);
        return ToAuthResponse(tokens, user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request, string? ipAddress)
    {
        var user = await userManager.FindByEmailAsync(request.Email)
            ?? throw new UnauthorizedException("Invalid email or password.");

        var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);
        if (!result.Succeeded)
            throw new UnauthorizedException("Invalid email or password.");

        var tokens = await IssueTokensAsync(user, ipAddress);
        return ToAuthResponse(tokens, user);
    }

    public async Task<TokenResponse> RefreshAsync(string refreshToken, string? ipAddress)
    {
        var tokenHash = tokenService.HashToken(refreshToken);
        var existing = await dbContext.RefreshTokens
            .Include(rt => rt.User)
            .FirstOrDefaultAsync(rt => rt.TokenHash == tokenHash);

        if (existing is null || !existing.IsActive)
            throw new UnauthorizedException("Invalid or expired refresh token.");

        existing.RevokedAt = DateTime.UtcNow;

        var tokens = await IssueTokensAsync(existing.User, ipAddress);
        existing.ReplacedByTokenHash = tokenService.HashToken(tokens.RefreshToken);

        await dbContext.SaveChangesAsync();
        return tokens;
    }

    public async Task LogoutAsync(string refreshToken)
    {
        var tokenHash = tokenService.HashToken(refreshToken);
        var existing = await dbContext.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.TokenHash == tokenHash);

        if (existing is not null && existing.IsActive)
        {
            existing.RevokedAt = DateTime.UtcNow;
            await dbContext.SaveChangesAsync();
        }
    }

    private async Task<TokenResponse> IssueTokensAsync(ApplicationUser user, string? ipAddress)
    {
        var accessToken = tokenService.GenerateAccessToken(user);
        var (rawRefreshToken, refreshTokenEntity) = tokenService.GenerateRefreshToken(user.Id, ipAddress);

        dbContext.RefreshTokens.Add(refreshTokenEntity);
        await dbContext.SaveChangesAsync();

        return new TokenResponse
        {
            AccessToken = accessToken,
            AccessTokenExpiresAt = DateTime.UtcNow.AddMinutes(jwtOptions.AccessTokenMinutes),
            RefreshToken = rawRefreshToken,
            RefreshTokenExpiresAt = refreshTokenEntity.ExpiresAt
        };
    }

    private AuthResponse ToAuthResponse(
    TokenResponse tokens,
    ApplicationUser user)
    {
        return new AuthResponse
        {
            AccessToken = tokens.AccessToken,
            AccessTokenExpiresAt = tokens.AccessTokenExpiresAt,
            RefreshToken = tokens.RefreshToken,
            RefreshTokenExpiresAt = tokens.RefreshTokenExpiresAt,
            User = user.ToResponse(mediaUrlService)
        };
    }
}