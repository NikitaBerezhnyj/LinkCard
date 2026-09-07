namespace LinkCard.Services.Interfaces;

public interface IFileStorage
{
    Task UploadAsync(
        Stream content,
        string key,
        string contentType,
        CancellationToken ct = default);

    Task DeleteAsync(
        string key,
        CancellationToken ct = default);
}