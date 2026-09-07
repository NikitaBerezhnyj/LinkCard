namespace LinkCard.Options;

public class S3Options
{
    public required string AccessKey { get; set; }
    public required string SecretKey { get; set; }
    public required string BucketName { get; set; }

    public required string Endpoint { get; set; }
    public required string PublicBaseUrl { get; set; }

    public string Region { get; set; } = "us-east-1";
}