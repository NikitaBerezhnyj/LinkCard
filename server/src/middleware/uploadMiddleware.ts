import multer from "multer";

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "image/gif" && file.size > 5 * 1024 * 1024) {
      cb(new Error("GIF files must be under 5MB"));
      return;
    }
    cb(null, true);
  }
});
