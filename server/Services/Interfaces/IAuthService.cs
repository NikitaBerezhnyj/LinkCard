using LinkCard.DTOs.Auth;

namespace LinkCard.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request, string? ipAddress);
    Task<AuthResponse> LoginAsync(LoginRequest request, string? ipAddress);
    Task<TokenResponse> RefreshAsync(string refreshToken, string? ipAddress);
    Task LogoutAsync(string refreshToken);
}