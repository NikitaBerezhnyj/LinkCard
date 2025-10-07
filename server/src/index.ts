import dotenv from "dotenv";
import connectionServer from "./config/serverConfig";
import connectionDB from "./config/dbConfig";

dotenv.config();

const app = connectionServer();

const host: string = process.env.SERVER_HOST || "localhost";
const port: number = Number(process.env.SERVER_PORT) || 5000;

const startServer = async (): Promise<void> => {
  try {
    await connectionDB();

    app.listen(port, host, () => {
      console.log(`Server started on http://${host}:${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
};

startServer();
