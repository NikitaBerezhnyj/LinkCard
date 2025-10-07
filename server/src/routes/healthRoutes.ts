import { Router, Request, Response } from "express";
import mongoose from "mongoose";

const router = Router();

router.get("/healthcheck", async (req: Request, res: Response) => {
  let dbStatus = "disconnected";

  try {
    if (mongoose.connection.readyState === 1) {
      dbStatus = "connected";
    } else if (mongoose.connection.readyState === 2) {
      dbStatus = "connecting";
    } else if (mongoose.connection.readyState === 3) {
      dbStatus = "disconnecting";
    }

    res.status(200).json({
      status: "ok",
      database: dbStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Healthcheck error:", error);
    res.status(500).json({
      status: "error",
      database: dbStatus,
      message: "Failed to check health",
      timestamp: new Date().toISOString()
    });
  }
});

export default router;
