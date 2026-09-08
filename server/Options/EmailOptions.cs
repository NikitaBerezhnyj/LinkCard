namespace LinkCard.Options;

public class EmailOptions
{
    public string Host { get; init; } = string.Empty;
    public int Port { get; init; }
    public string Email { get; init; } = string.Empty;
    public string? Password { get; init; }
    public string FromName { get; init; } = "LinkCard";
    public string PasswordResetUrl { get; init; } = string.Empty;
}