using System.Net;
using Amazon.S3;
using Amazon.S3.Model;
using LinkCard.Options;

namespace LinkCard.Services;

public class S3BucketInitializer(IAmazonS3 client, S3Options options, ILogger<S3BucketInitializer> logger) : IHostedService
{
    public async Task StartAsync(CancellationToken ct)
    {
        if (string.IsNullOrEmpty(options.Endpoint))
            return;

        if (!await BucketExistsAsync(ct))
        {
            await client.PutBucketAsync(options.BucketName, ct);
            logger.LogInformation("Bucket {Bucket} created", options.BucketName);
        }

        var policy = $$"""
        {
          "Version": "2012-10-17",
          "Statement": [
            {
              "Sid": "PublicRead",
              "Effect": "Allow",
              "Principal": "*",
              "Action": ["s3:GetObject"],
              "Resource": ["arn:aws:s3:::{{options.BucketName}}/*"]
            }
          ]
        }
        """;

        await client.PutBucketPolicyAsync(new PutBucketPolicyRequest
        {
            BucketName = options.BucketName,
            Policy = policy
        }, ct);

        logger.LogInformation("Bucket {Bucket} is now public-read", options.BucketName);
    }

    public Task StopAsync(CancellationToken ct) => Task.CompletedTask;

    private async Task<bool> BucketExistsAsync(CancellationToken ct)
    {
        try
        {
            await client.GetBucketLocationAsync(options.BucketName, ct);
            return true;
        }
        catch (AmazonS3Exception ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            return false;
        }
    }
}