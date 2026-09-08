using LinkCard.Entities.Enums;

namespace LinkCard.DTOs.Users.Responses;

public class TypographyResponse
{
    public string? Font { get; set; }
    public string? FontSize { get; set; }
    public FontWeight? FontWeight { get; set; }
    public TextAlign? TextAlign { get; set; }
}