import dotenv from "dotenv";
import mongoose from "mongoose";
import {
  S3Client,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { User } from "./models/userModel.js";

dotenv.config();

const mongoUri = process.env.DB;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

const s3Client = new S3Client({
  region: "us-east-1",
  endpoint: `http://minio:${process.env.MINIO_API_PORT}`,
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER,
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD,
  },
  forcePathStyle: true,
});

const BUCKET = process.env.MINIO_BUCKET || "linkcard";

const cleanup = async () => {
  try {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const users = await User.find(
      {},
      "avatar styles.background.value.image"
    ).lean();

    const usedKeys = new Set();
    for (const user of users) {
      if (user.avatar) usedKeys.add(user.avatar.split("/").pop());
      const bgImage = user.styles?.background?.value?.image;
      if (bgImage) usedKeys.add(bgImage.split("/").pop());
    }

    const list = await s3Client.send(
      new ListObjectsV2Command({ Bucket: BUCKET })
    );

    for (const obj of list.Contents || []) {
      const key = obj.Key;
      const lastModified = obj.LastModified;

      if (!usedKeys.has(key) && lastModified < cutoff) {
        console.log("Deleting:", key);
        await s3Client.send(
          new DeleteObjectCommand({ Bucket: BUCKET, Key: key })
        );
      }
    }

    console.log("Cleanup finished");
  } catch (err) {
    console.error("Cleanup error:", err);
  } finally {
    mongoose.connection.close();
  }
};

const main = async () => {
  await connectDB();
  await cleanup();
  setInterval(() => {
    cleanup();
  }, 12 * 60 * 60 * 1000);
};

main();
