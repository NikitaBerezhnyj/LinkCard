import sharp from "sharp";

interface OptimizeOptions {
  type: "avatar" | "background";
  mimetype: string;
}

export const optimizeImage = async (buffer: Buffer, options: OptimizeOptions): Promise<Buffer> => {
  const { type, mimetype } = options;

  const image = sharp(buffer);

  if (type === "avatar") {
    return image
      .resize({ width: 512, height: 512, fit: "cover" })
      .toFormat("webp", { quality: 80 })
      .toBuffer();
  }

  if (type === "background") {
    const format = mimetype === "image/png" ? "png" : "jpeg";
    return image
      .resize({ width: 3840, withoutEnlargement: true })
      .toFormat(format, { quality: 85 })
      .toBuffer();
  }

  return buffer;
};
