import { Request, Response } from "express";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/s3Config";
import { optimizeImage } from "../utils/imageProcessor";

const validateMIMEType = async (
  mimetype: string,
  options: { allowMimeTypes: string[] }
): Promise<{ ok: boolean }> => {
  const { allowMimeTypes } = options;
  return { ok: allowMimeTypes.includes(mimetype) };
};

const uploadFileToS3 = async (buffer: Buffer, key: string) => {
  const command = new PutObjectCommand({
    Bucket: process.env.MINIO_BUCKET,
    Key: key,
    Body: buffer
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
      allowMimeTypes: ["image/jpeg", "image/png", "image/webp"]
    });

    if (!validationResult.ok) {
      res.status(400).send({ message: "Unsupported file type" });
      return;
    }

    const optimizedBuffer = await optimizeImage(req.file.buffer, {
      type: "avatar",
      mimetype: req.file.mimetype
    });

    const key = `avatars/${req.file.originalname.split(".")[0]}.webp`;
    await uploadFileToS3(optimizedBuffer, key);

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
      allowMimeTypes: ["image/jpeg", "image/png", "image/webp"]
    });

    if (!validationResult.ok) {
      res.status(400).send({ message: "Unsupported file type" });
      return;
    }

    const optimizedBuffer = await optimizeImage(req.file.buffer, {
      type: "background",
      mimetype: req.file.mimetype
    });

    const key = `backgrounds/${req.file.originalname}`;
    await uploadFileToS3(optimizedBuffer, key);

    res.status(200).json({
      filePath: `http://localhost:${process.env.MINIO_API_PORT}/${process.env.MINIO_BUCKET}/${key}`
    });
  } catch (error) {
    console.error("Error uploading background to MinIO:", error);
    res.status(500).send({ message: "Error uploading background" });
  }
};
