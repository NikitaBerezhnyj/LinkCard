namespace LinkCard.Services.Interfaces;

public enum ImageKind { Avatar, Background }

public interface IImageProcessor
{
    Task<(Stream Stream, string ContentType, string Extension)> ProcessAsync(
        Stream input, string contentType, ImageKind kind, CancellationToken ct = default);
}