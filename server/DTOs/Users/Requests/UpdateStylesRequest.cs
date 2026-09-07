namespace LinkCard.DTOs.Users.Requests;

public class UpdateStylesRequest
{
    public UpdateTypographyRequest? Typography { get; set; }
    public UpdateColorSchemeRequest? Colors { get; set; }
    public UpdateLayoutRequest? Layout { get; set; }
    public UpdateBackgroundRequest? Background { get; set; }
}