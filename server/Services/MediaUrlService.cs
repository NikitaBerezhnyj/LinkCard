using LinkCard.Options;
using LinkCard.Services.Interfaces;

namespace LinkCard.Services;

public class MediaUrlService(S3Options options) : IMediaUrlService
{
    public string GetUrl(string key)
    {
        return $"{options.PublicBaseUrl.TrimEnd('/')}/" +
               $"{options.BucketName}/" +
               $"{key}";
    }
}