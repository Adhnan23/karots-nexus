import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// The whole API is under `/api` (Worker), so in dev we proxy just that one
// prefix to the local Worker (:8787) — the SPA and API share an origin (no
// CORS), and SPA client routes like `/weather` never collide with the API.
const proxy = {
  "/api": { target: "http://localhost:8787", changeOrigin: true },
};

export default defineConfig({
  resolve: {
    alias: { "@": new URL("./src", import.meta.url).pathname },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg"],
      manifest: {
        name: "Karots Nexus",
        short_name: "Karots",
        description: "Agriculture intelligence for Sri Lanka",
        theme_color: "#16a34a",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy,
  },
});
