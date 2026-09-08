using System.Security.Claims;
using LinkCard.Common.Exceptions;

namespace LinkCard.Common.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal user)
    {
        var idClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (idClaim is null || !Guid.TryParse(idClaim, out var userId))
            throw new UnauthorizedException("Invalid token.");
        return userId;
    }
}