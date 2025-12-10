/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import fs from "fs";
import * as path from "path";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";
import packageJson from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint(),
    {
      name: "exclude-msw",
      apply: "build",
      closeBundle() {
        const mswPath = path.resolve(__dirname, "dist/mockServiceWorker.js");

        if (fs.existsSync(mswPath)) {
          fs.unlinkSync(mswPath);
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
        quietDeps: true,
        silenceDeprecations: ["import", "global-builtin"],
      },
    },
  },
});
