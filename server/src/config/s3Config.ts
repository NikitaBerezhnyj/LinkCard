import {
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
  S3ServiceException
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const REGION = "us-east-1";
const ENDPOINT = `http://minio:${process.env.MINIO_API_PORT}`;

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

async function ensureBucketExists(bucketName: string) {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
    console.log(`Bucket ${bucketName} already exists`);
  } catch (err) {
    const error = err as S3ServiceException;
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
      console.log(`Bucket ${bucketName} created`);
    } else {
      console.error("Error checking/creating bucket:", error);
      throw error;
    }
  }

  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicRead",
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${bucketName}/*`]
      }
    ]
  };

  await s3Client.send(
    new PutBucketPolicyCommand({
      Bucket: bucketName,
      Policy: JSON.stringify(policy)
    })
  );
  console.log(`Bucket ${bucketName} is now public`);
}

(async () => {
  await ensureBucketExists(process.env.MINIO_BUCKET || "linkcard");
})();
