import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const REGION = "us-east-1";
const ENDPOINT = `http://${process.env.SERVER_HOST}:${process.env.MINIO_API_PORT}`;

export const s3Client = new S3Client({
  region: REGION,
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: process.env.MINIO_ROOT_USER || "",
    secretAccessKey: process.env.MINIO_ROOT_PASSWORD || ""
  },
  forcePathStyle: true
});

console.log("MinIO client configured successfully");
