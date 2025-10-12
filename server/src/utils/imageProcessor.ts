import sharp from "sharp";

interface OptimizeOptions {
  type: "avatar" | "background";
  mimetype: string;
}

const OPTIMIZABLE_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/tiff",
  "image/gif"
];

const PASSTHROUGH_FORMATS = ["image/gif", "image/svg+xml"];

const MIN_DIMENSIONS = {
  avatar: { width: 100, height: 100 },
  background: { width: 800, height: 600 }
};

const validateImageDimensions = async (
  buffer: Buffer,
  type: "avatar" | "background",
  mimetype: string
): Promise<void> => {
  if (mimetype === "image/svg+xml") {
    return;
  }

  try {
    const metadata = await sharp(buffer).metadata();
    const minDims = MIN_DIMENSIONS[type];

    if (metadata.width && metadata.width < minDims.width) {
      throw new Error(`Image width too small: ${metadata.width}px (minimum ${minDims.width}px)`);
    }

    if (metadata.height && metadata.height < minDims.height) {
      throw new Error(`Image height too small: ${metadata.height}px (minimum ${minDims.height}px)`);
    }

    console.log(`Image dimensions: ${metadata.width}x${metadata.height}`);
  } catch (error) {
    if (error instanceof Error && error.message.includes("too small")) {
      throw error;
    }
    console.warn("Could not validate image dimensions:", error);
  }
};

const getBackgroundFormat = (mimetype: string): "jpeg" | "png" | "webp" => {
  if (mimetype === "image/png") return "png";
  if (mimetype === "image/webp") return "webp";
  return "jpeg";
};

const optimizeAvatar = async (buffer: Buffer): Promise<Buffer> => {
  return await sharp(buffer)
    .resize({ width: 512, height: 512, fit: "cover" })
    .toFormat("webp", { quality: 80 })
    .toBuffer();
};

const optimizeBackground = async (buffer: Buffer, mimetype: string): Promise<Buffer> => {
  const format = getBackgroundFormat(mimetype);

  return await sharp(buffer)
    .resize({ width: 3840, withoutEnlargement: true })
    .toFormat(format, {
      quality: 85,
      ...(format === "png" && { compressionLevel: 9 })
    })
    .toBuffer();
};

const shouldOptimize = (mimetype: string): boolean => {
  if (PASSTHROUGH_FORMATS.includes(mimetype)) {
    console.log(`Skipping optimization for ${mimetype}`);
    return false;
  }

  if (!OPTIMIZABLE_FORMATS.includes(mimetype)) {
    console.warn(`Unsupported format for optimization: ${mimetype}`);
    return false;
  }

  return true;
};

export const optimizeImage = async (buffer: Buffer, options: OptimizeOptions): Promise<Buffer> => {
  const { type, mimetype } = options;

  await validateImageDimensions(buffer, type, mimetype);

  if (!shouldOptimize(mimetype)) {
    return buffer;
  }

  try {
    if (type === "avatar") {
      return await optimizeAvatar(buffer);
    }

    if (type === "background") {
      return await optimizeBackground(buffer, mimetype);
    }

    return buffer;
  } catch (error) {
    console.error("Error optimizing image:", error);
    throw error;
  }
};

export const getFinalExtension = (
  originalMimetype: string,
  type: "avatar" | "background"
): string => {
  if (type === "avatar") {
    return "webp";
  }

  const extensionMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
    "image/tiff": "tiff",
    "image/svg+xml": "svg"
  };

  return extensionMap[originalMimetype] || "jpg";
};
