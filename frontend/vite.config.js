import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  preview: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: [
      "auditlensfrontend-production.up.railway.app"
    ]
  }
});