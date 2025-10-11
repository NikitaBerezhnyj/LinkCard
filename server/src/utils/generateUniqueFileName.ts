import { s3Client } from "../config/s3Config";
import { HeadObjectCommand } from "@aws-sdk/client-s3";

function getShortDateTime(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
}

async function checkFileExists(bucket: string, key: string): Promise<boolean> {
  try {
    await s3Client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

export async function generateUniqueFileName(
  bucket: string,
  folder: string,
  originalName: string,
  extension = "webp"
): Promise<string> {
  const baseName = originalName.split(".")[0].slice(0, 10).replace(/\s+/g, "_");
  let fileName = `${getShortDateTime()}_${baseName}.${extension}`;
  let key = `${folder}/${fileName}`;

  let attempt = 0;
  while (await checkFileExists(bucket, key)) {
    const randomPart = Math.floor(Math.random() * 10000);
    fileName = `${getShortDateTime()}_${baseName}_${randomPart}.${extension}`;
    key = `${folder}/${fileName}`;
    attempt++;
    if (attempt > 5) break;
  }

  return key;
}
