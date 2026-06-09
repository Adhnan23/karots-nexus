import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// API path prefixes owned by the Worker. In dev they are proxied to the local
// Worker (:8787) so the SPA and API share an origin and need no CORS.
const API_PREFIXES = ["/agriculture", "/weather", "/knowledge", "/districts", "/health", "/admin"];
const proxy = Object.fromEntries(
  API_PREFIXES.map((p) => [p, { target: "http://localhost:8787", changeOrigin: true }]),
);

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
