import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  // This ensures your site works on Vercel's generated URLs
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      // Points to where your assets actually are in the repo
      "@assets": path.resolve(__dirname, "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  // Tells Vite to look in this folder for the index.html
  root: path.resolve(__dirname),
  build: {
    // Standard Vercel output location
    chunkSizeWarningLimit: 1000, // Raises the limit so it stops complaining
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
});
