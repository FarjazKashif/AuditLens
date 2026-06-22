import cors from "cors";
import express from "express";
import morgan from "morgan";
import routes from "./routes/index.js";
import { errorHandler } from "./utils/errorHandler.js";

export function createApp() {
  const app = express();

  // Initial Commit
  app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
  app.use(express.json({ limit: "5mb" }));
  app.use(morgan("dev"));

  app.use("/api", routes);
  app.use(errorHandler);

  return app;
}
