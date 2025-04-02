/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import * as path from "path";
import packageJson from "./package.json";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    eslint(),
    sentryVitePlugin({
      org: "canonical",
      project: "landscape-dashboard",
    }),
    basicSsl({
      name: "landscape-dashboard-local",
      domains: ["*.yuriy.works", "localhost"],
      certDir: "./.cert",
    }),
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
