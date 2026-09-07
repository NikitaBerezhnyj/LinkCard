using LinkCard.Entities;

namespace LinkCard.DTOs.Users.Requests;

public class UpdateBackgroundRequest
{
    public BackgroundType? Type { get; set; }
    public UpdateBackgroundValueRequest? Value { get; set; }
}