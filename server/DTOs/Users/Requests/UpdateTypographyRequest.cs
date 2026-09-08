using LinkCard.Entities.Enums;

namespace LinkCard.DTOs.Users.Requests;

public class UpdateTypographyRequest
{
    public string? Font { get; set; }
    public string? FontSize { get; set; }
    public FontWeight? FontWeight { get; set; }
    public TextAlign? TextAlign { get; set; }
}