namespace LinkCard.DTOs.Users.Responses;

public class UserLinkResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public int Order { get; set; }
}