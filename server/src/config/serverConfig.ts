import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import express, { Express, Request, Response } from "express";
import userRoutes from "../routes/userRoutes";
import uploadRoutes from "../routes/uploadRoutes";
import healthRoutes from "../routes/healthRoutes";

const createServer = (): Express => {
  const app = express();

  const requiredEnvVars: string[] = [
    "SERVER_PORT",
    "SERVER_HOST",
    "ORIGIN_WEBSITE",
    "DB",
    "SALT",
    "JWT_PRIVATE_TOKEN",
    "SMTP_EMAIL",
    "SMTP_PASSWORD"
  ];

  const missingVars: string[] = requiredEnvVars.filter(key => !process.env[key]);

  if (missingVars.length > 0) {
    console.error(`Missing necessary environment variables: ${missingVars.join(", ")}`);
    process.exit(1);
  }

  const allowedOrigins = [process.env.ORIGIN_WEBSITE].filter(Boolean) as string[];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("CORS origin denied"));
      },
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true
    })
  );

  app.use(express.json());
  app.use(cookieParser());

  const publicPath = path.join(__dirname, "../public");
  app.use(express.static(publicPath));

  app.get("/", (_req: Request, res: Response) => {
    res.sendFile(path.join(publicPath, "index.html"));
  });

  app.use("/api", healthRoutes);
  app.use("/api", userRoutes);
  app.use("/api", uploadRoutes);

  return app;
};

export default createServer;
