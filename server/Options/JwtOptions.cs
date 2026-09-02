namespace LinkCard.Options;

public class JwtOptions
{
    public required string Secret { get; set; }
    public string Issuer { get; set; } = "LinkCard";
    public string Audience { get; set; } = "LinkCard";
    public int AccessTokenMinutes { get; set; } = 15;
    public int RefreshTokenDays { get; set; } = 30;
}