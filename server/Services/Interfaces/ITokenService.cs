using LinkCard.Entities;

namespace LinkCard.Services.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(ApplicationUser user);
    (string RawToken, RefreshToken Entity) GenerateRefreshToken(Guid userId, string? createdByIp);
    string HashToken(string token);
}