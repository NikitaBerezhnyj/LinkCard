namespace LinkCard.DTOs.Users.Requests;

public class UpdateUserRequest
{
    public string? Username { get; set; }
    public string? Email { get; set; }
    public string? Bio { get; set; }
    public List<UpdateLinkRequest>? Links { get; set; }
    public UpdateStylesRequest? Styles { get; set; }
}