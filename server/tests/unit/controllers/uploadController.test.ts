import { Request, Response } from "express";
import * as uploadController from "../../../src/controllers/uploadController";
import { s3Client } from "../../../src/config/s3Config";
import { PutObjectCommand } from "@aws-sdk/client-s3";

// Мок AWS S3
jest.mock("../../../src/config/s3Config", () => ({
  s3Client: { send: jest.fn() }
}));

describe("Upload Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    sendMock = jest.fn().mockReturnThis();

    res = {
      status: statusMock,
      json: jsonMock,
      send: sendMock
    };
    req = {};
    jest.clearAllMocks();
  });

  describe("uploadAvatar", () => {
    it("should return 400 if no file uploaded", async () => {
      req.file = undefined;
      await uploadController.uploadAvatar(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(sendMock).toHaveBeenCalledWith({ message: "No file uploaded" });
    });

    it("should return 400 for unsupported MIME type", async () => {
      req.file = {
        fieldname: "file",
        originalname: "file.txt",
        encoding: "7bit",
        mimetype: "text/plain",
        size: 0,
        buffer: Buffer.from(""),
        destination: "",
        filename: "",
        path: "",
        stream: {} as any
      } as Express.Multer.File;

      await uploadController.uploadAvatar(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(sendMock).toHaveBeenCalledWith({ message: "Unsupported file type" });
    });

    it("should upload avatar and return file path", async () => {
      req.file = {
        fieldname: "file",
        originalname: "avatar.png",
        encoding: "7bit",
        mimetype: "image/png",
        size: 123,
        buffer: Buffer.from("data"),
        destination: "",
        filename: "",
        path: "",
        stream: {} as any
      } as Express.Multer.File;

      process.env.SERVER_HOST = "localhost";
      process.env.MINIO_WEB_PORT = "9000";
      process.env.MINIO_BUCKET = "bucket";

      await uploadController.uploadAvatar(req as Request, res as Response);

      expect(s3Client.send).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        filePath: `http://localhost:9000/bucket/avatars/avatar.png`
      });
    });
  });

  describe("uploadBackground", () => {
    it("should return 400 if no file uploaded", async () => {
      req.file = undefined;
      await uploadController.uploadBackground(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(sendMock).toHaveBeenCalledWith({ message: "No file uploaded" });
    });

    it("should upload background and return file path", async () => {
      req.file = {
        fieldname: "file",
        originalname: "bg.jpg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        size: 123,
        buffer: Buffer.from("data"),
        destination: "",
        filename: "",
        path: "",
        stream: {} as any
      } as Express.Multer.File;

      process.env.SERVER_HOST = "localhost";
      process.env.MINIO_WEB_PORT = "9000";
      process.env.MINIO_BUCKET = "bucket";

      await uploadController.uploadBackground(req as Request, res as Response);

      expect(s3Client.send).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        filePath: `http://localhost:9000/bucket/backgrounds/bg.jpg`
      });
    });
  });
});
