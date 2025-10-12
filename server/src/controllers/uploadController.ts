import { Request, Response } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/s3Config";
import { optimizeImage, getFinalExtension } from "../utils/imageProcessor";
import { generateUniqueFileName } from "../utils/generateUniqueFileName";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/tiff",
  "image/bmp",
  "image/svg+xml"
];

const validateMIMEType = async (
  mimetype: string,
  options: { allowMimeTypes: string[] }
): Promise<{ ok: boolean }> => {
  const { allowMimeTypes } = options;
  return { ok: allowMimeTypes.includes(mimetype) };
};

const uploadFileToS3 = async (buffer: Buffer, key: string, mimetype: string) => {
  const command = new PutObjectCommand({
    Bucket: process.env.MINIO_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: mimetype
  });
  await s3Client.send(command);
};

export const uploadAvatar = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).send({ message: "No file uploaded" });
    return;
  }

  try {
    const validationResult = await validateMIMEType(req.file.mimetype, {
      allowMimeTypes: ALLOWED_IMAGE_TYPES
    });

    if (!validationResult.ok) {
      res.status(400).send({ message: "Unsupported file type" });
      return;
    }

    const optimizedBuffer = await optimizeImage(req.file.buffer, {
      type: "avatar",
      mimetype: req.file.mimetype
    });

    const extension = getFinalExtension(req.file.mimetype, "avatar");

    const key = await generateUniqueFileName(
      process.env.MINIO_BUCKET || "linkcard",
      "avatars",
      req.file.originalname,
      extension
    );

    const finalMimetype = extension === "webp" ? "image/webp" : req.file.mimetype;
    await uploadFileToS3(optimizedBuffer, key, finalMimetype);

    res.status(200).json({
      filePath: `http://localhost:${process.env.MINIO_API_PORT}/${process.env.MINIO_BUCKET}/${key}`
    });
  } catch (error) {
    console.error("Error uploading avatar to MinIO:", error);
    res.status(500).send({ message: "Error uploading avatar" });
  }
};

export const uploadBackground = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).send({ message: "No file uploaded" });
    return;
  }

  try {
    const validationResult = await validateMIMEType(req.file.mimetype, {
      allowMimeTypes: ALLOWED_IMAGE_TYPES
    });

    if (!validationResult.ok) {
      res.status(400).send({ message: "Unsupported file type" });
      return;
    }

    const optimizedBuffer = await optimizeImage(req.file.buffer, {
      type: "background",
      mimetype: req.file.mimetype
    });

    const extension = getFinalExtension(req.file.mimetype, "background");

    const key = await generateUniqueFileName(
      process.env.MINIO_BUCKET || "linkcard",
      "backgrounds",
      req.file.originalname,
      extension
    );

    await uploadFileToS3(optimizedBuffer, key, req.file.mimetype);

    res.status(200).json({
      filePath: `http://localhost:${process.env.MINIO_API_PORT}/${process.env.MINIO_BUCKET}/${key}`
    });
  } catch (error) {
    console.error("Error uploading background to MinIO:", error);
    res.status(500).send({ message: "Error uploading background" });
  }
};
