import dotenv from "dotenv";
import { createApp } from "./app.js";
import { connectMongo } from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 5000;
const app = createApp();

connectMongo(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`AuditLens API listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start AuditLens API", error);
    process.exit(1);
  });
