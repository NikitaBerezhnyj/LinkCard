using LinkCard.Entities;

namespace LinkCard.DTOs.Users;

public class UpdateTypographyRequest
{
    public string? Font { get; set; }
    public string? FontSize { get; set; }
    public string? FontWeight { get; set; }
    public TextAlign? TextAlign { get; set; }
}