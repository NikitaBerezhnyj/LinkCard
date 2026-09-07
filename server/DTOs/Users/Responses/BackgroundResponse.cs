using LinkCard.Entities;

namespace LinkCard.DTOs.Users.Responses;

public class BackgroundResponse
{
    public BackgroundType Type { get; set; }
    public BackgroundValueResponse Value { get; set; } = new();
}