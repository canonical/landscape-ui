/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import * as path from "path";
import packageJson from "./package.json";
import * as fs from "node:fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint(),
    {
      name: "remove-mock-service-worker",
      apply: "build",
      enforce: "post",
      closeBundle() {
        const outputDir = path.resolve(__dirname, "dist");
        const mockFile = path.join(outputDir, "mockServiceWorker.js");
        if (fs.existsSync(mockFile)) {
          fs.unlinkSync(mockFile);
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
        quietDeps: true,
      },
    },
  },
});
