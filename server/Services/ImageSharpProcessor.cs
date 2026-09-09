using LinkCard.Common.Exceptions;
using LinkCard.Services.Interfaces;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Gif;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace LinkCard.Services;

public class ImageSharpProcessor : IImageProcessor
{
    private const int MaxSourceDimension = 8000;

    private static readonly Dictionary<ImageKind, (int Width, int Height)> MinDimensions = new()
    {
        [ImageKind.Avatar] = (100, 100),
        [ImageKind.Background] = (400, 200)
    };

    public async Task<(Stream Stream, string ContentType, string Extension)> ProcessAsync(
        Stream input, string contentType, ImageKind kind, CancellationToken ct = default)
    {
        var buffer = new MemoryStream();
        await input.CopyToAsync(buffer, ct);
        buffer.Position = 0;

        ImageInfo info;
        try
        {
            info = await Image.IdentifyAsync(buffer, ct)
                ?? throw new BadRequestException("File is not a recognizable image.");
        }
        catch (Exception ex) when (ex is ImageFormatException or NotSupportedException)
        {
            throw new BadRequestException("File is not a valid or supported image.");
        }

        if (info.Width > MaxSourceDimension || info.Height > MaxSourceDimension)
            throw new BadRequestException(
                $"Image dimensions too large: {info.Width}x{info.Height}px (maximum {MaxSourceDimension}x{MaxSourceDimension}px).");

        buffer.Position = 0;
        using var image = await Image.LoadAsync(buffer, ct);
        var detectedFormat = image.Metadata.DecodedImageFormat;

        var minDims = MinDimensions[kind];
        if (image.Width < minDims.Width || image.Height < minDims.Height)
            throw new BadRequestException(
                $"Image is too small: {image.Width}x{image.Height}px (minimum {minDims.Width}x{minDims.Height}px).");

        if (detectedFormat is GifFormat)
        {
            buffer.Position = 0;
            return (buffer, "image/gif", "gif");
        }

        var output = new MemoryStream();

        if (kind == ImageKind.Avatar)
        {
            image.Mutate(x => x.Resize(new ResizeOptions { Size = new Size(512, 512), Mode = ResizeMode.Crop }));
            return await EncodeAsync(image, output, new WebpEncoder { Quality = 80 }, "image/webp", "webp", ct);
        }

        if (image.Width > 3840)
        {
            var ratio = 3840d / image.Width;
            image.Mutate(x => x.Resize(3840, (int)(image.Height * ratio)));
        }

        return detectedFormat switch
        {
            PngFormat => await EncodeAsync(image, output,
                new PngEncoder { CompressionLevel = PngCompressionLevel.BestCompression }, "image/png", "png", ct),
            WebpFormat => await EncodeAsync(image, output,
                new WebpEncoder { Quality = 85 }, "image/webp", "webp", ct),
            _ => await EncodeAsync(image, output,
                new JpegEncoder { Quality = 85 }, "image/jpeg", "jpg", ct)
        };
    }

    private static async Task<(Stream, string, string)> EncodeAsync(
        Image image, MemoryStream output, IImageEncoder encoder, string contentType, string extension, CancellationToken ct)
    {
        await image.SaveAsync(output, encoder, ct);
        output.Position = 0;
        return (output, contentType, extension);
    }
}