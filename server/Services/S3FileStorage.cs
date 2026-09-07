using Amazon.S3;
using Amazon.S3.Model;
using LinkCard.Options;
using LinkCard.Services.Interfaces;

namespace LinkCard.Services;

public class S3FileStorage(
    IAmazonS3 client,
    S3Options options) : IFileStorage
{
    public async Task UploadAsync(
        Stream content,
        string key,
        string contentType,
        CancellationToken ct = default)
    {
        var request = new PutObjectRequest
        {
            BucketName = options.BucketName,
            Key = key,
            InputStream = content,
            ContentType = contentType
        };

        await client.PutObjectAsync(request, ct);
    }

    public async Task DeleteAsync(
        string key,
        CancellationToken ct = default)
    {
        await client.DeleteObjectAsync(
            options.BucketName,
            key,
            ct);
    }
}