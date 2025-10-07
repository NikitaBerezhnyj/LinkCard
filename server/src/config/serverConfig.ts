import cors from "cors";
import express, { Express } from "express";
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

  const allowedOrigins = [process.env.ORIGIN_WEBSITE, "*"].filter((origin): origin is string =>
    Boolean(origin)
  );

  app.use(
    cors({
      origin: allowedOrigins,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    })
  );
  app.use(express.json());

  app.use("/api", healthRoutes);
  app.use("/api", userRoutes);
  app.use("/api", uploadRoutes);

  return app;
};

export default createServer;
