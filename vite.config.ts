import fs from "fs";
import * as path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
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
    optimizeDeps: {
      exclude: ["monaco-editor"],
    },
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: ["import", "global-builtin"],
        },
      },
    },
    preview: {
      port: 4173,
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY_TARGET || "http://localhost:8080",
          changeOrigin: true,
          secure: false,
        },
        ...(env.VITE_MSW_ENABLED !== "true" &&
          (() => {
            const debArchivePath = (env.VITE_API_URL_DEB_ARCHIVE ?? "").replace(
              /\/$/,
              "",
            );
            return {
              "/debarchive": {
                target:
                  env.VITE_DEBARCHIVE_PROXY_TARGET || "http://localhost:8000",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/debarchive/, ""),
              },
              [debArchivePath]: {
                target:
                  env.VITE_API_DEBARCHIVE_PROXY_TARGET ||
                  "http://localhost:8000",
                changeOrigin: true,
                secure: false,
              },
            };
          })()),
      },
    },
  };
});
