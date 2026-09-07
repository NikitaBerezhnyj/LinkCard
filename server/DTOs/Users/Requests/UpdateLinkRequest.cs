namespace LinkCard.DTOs.Users.Requests;

public class UpdateLinkRequest
{
    public Guid? Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
}