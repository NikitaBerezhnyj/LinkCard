namespace LinkCard.Services;

public static class EmailTemplateRenderer
{
    public static string RenderPasswordReset(string resetLink)
    {
        var path = Path.Combine(AppContext.BaseDirectory, "EmailTemplates", "PasswordReset.html");
        return File.ReadAllText(path).Replace("{{ResetUrl}}", resetLink);
    }
}