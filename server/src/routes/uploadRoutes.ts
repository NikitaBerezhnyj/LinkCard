import { Router } from "express";
import { uploadAvatar, uploadBackground } from "../controllers/uploadController";
import { uploadMiddleware } from "../middleware/uploadMiddleware";

const router = Router();

router.post("/upload-avatar", uploadMiddleware.single("file"), uploadAvatar);
router.post("/upload-background", uploadMiddleware.single("file"), uploadBackground);

export default router;
