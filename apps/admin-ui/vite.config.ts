/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import * as path from "path";
import packageJson from "../../package.json";

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react(), eslint()],
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
  server: {
    fs: {
      allow: [path.resolve(__dirname)],
    },
  },
});
