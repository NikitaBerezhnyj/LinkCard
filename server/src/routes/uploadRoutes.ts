import { Router } from "express";
import { uploadAvatar, uploadBackground } from "../controllers/uploadController";
import { uploadMiddleware } from "../middleware/uploadMiddleware";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/upload-avatar", authMiddleware, uploadMiddleware.single("file"), uploadAvatar);

router.post(
  "/upload-background",
  authMiddleware,
  uploadMiddleware.single("file"),
  uploadBackground
);

export default router;
