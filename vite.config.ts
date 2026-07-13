import fs from "fs";
import { createRequire } from "module";
import * as path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import type { Plugin, PreviewServer, ViteDevServer } from "vite";

const require = createRequire(import.meta.url);
const PRAGMA_ICONS_ROUTE = "/icons/";
const PRAGMA_ICONS_DIR = path.join(
  path.dirname(require.resolve("@canonical/ds-assets/package.json")),
  "icons",
);

const getPragmaIconPath = (requestUrl: string | undefined) => {
  const pathname = new URL(requestUrl ?? "", "http://localhost").pathname;

  if (!pathname.startsWith(PRAGMA_ICONS_ROUTE)) {
    return null;
  }

  let decodedIconPath: string;

  try {
    decodedIconPath = decodeURIComponent(
      pathname.slice(PRAGMA_ICONS_ROUTE.length),
    );
  } catch (error) {
    if (error instanceof URIError) {
      return null;
    }

    throw error;
  }

  const iconPath = path.normalize(decodedIconPath);

  if (!iconPath || iconPath.startsWith("..") || path.isAbsolute(iconPath)) {
    return null;
  }

  return path.join(PRAGMA_ICONS_DIR, iconPath);
};

const servePragmaIcons = (server: ViteDevServer | PreviewServer) => {
  server.middlewares.use((req, res, next) => {
    const filePath = getPragmaIconPath(req.url);

    if (!filePath) {
      next();
      return;
    }

    fs.stat(filePath, (error, stats) => {
      if (error || !stats.isFile()) {
        next();
        return;
      }

      res.setHeader("Content-Type", "image/svg+xml");
      fs.createReadStream(filePath).pipe(res);
    });
  });
};

export const createPragmaIconsPlugin = (): Plugin => {
  let root = process.cwd();
  let outDir = "dist";

  return {
    name: "serve-pragma-icons",
    configResolved(config) {
      root = config.root;
      outDir = config.build.outDir;
    },
    configureServer: servePragmaIcons,
    configurePreviewServer: servePragmaIcons,
    writeBundle() {
      fs.cpSync(PRAGMA_ICONS_DIR, path.resolve(root, outDir, "icons"), {
        recursive: true,
        force: true,
      });
    },
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      createPragmaIconsPlugin(),
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
