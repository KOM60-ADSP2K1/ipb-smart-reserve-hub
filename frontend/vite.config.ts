import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const backendUrl = process.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: "127.0.0.1",
    port: 5173,
    proxy: {
      "/docs": {
        target: backendUrl,
        changeOrigin: true,
      },
      "/openapi.json": {
        target: backendUrl,
        changeOrigin: true,
      },
      "/redoc": {
        target: backendUrl,
        changeOrigin: true,
      },
    },
  },
});
