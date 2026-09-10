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

const normalizeRootPath = (rootPath = "/") => {
  const absoluteRootPath = rootPath.startsWith("/") ? rootPath : `/${rootPath}`;

  return absoluteRootPath.endsWith("/")
    ? absoluteRootPath
    : `${absoluteRootPath}/`;
};

const getRelativeIconPath = (
  requestUrl: string | undefined,
  iconsRoutes: string[],
) => {
  const { pathname } = new URL(requestUrl ?? "", "http://localhost");
  const iconsRoute = iconsRoutes.find((route) => pathname.startsWith(route));

  if (!iconsRoute) {
    return null;
  }

  let decodedIconPath: string;

  try {
    decodedIconPath = decodeURIComponent(pathname.slice(iconsRoute.length));
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

  return iconPath;
};

export const getPragmaIconPath = (
  requestUrl: string | undefined,
  iconsRoutes: string[],
) => {
  const iconPath = getRelativeIconPath(requestUrl, iconsRoutes);

  return iconPath ? path.join(PRAGMA_ICONS_DIR, iconPath) : null;
};

const resolveIconFilePath = (iconPath: string, appIconsDir: string) => {
  const candidates = [
    path.join(appIconsDir, iconPath),
    path.join(PRAGMA_ICONS_DIR, iconPath),
  ];

  for (const candidate of candidates) {
    try {
      if (fs.statSync(candidate).isFile()) {
        return candidate;
      }
    } catch {
      // try next candidate
    }
  }

  return null;
};

const servePragmaIcons = (
  server: ViteDevServer | PreviewServer,
  iconsRoutes: string[],
  getAppIconsDir: () => string,
) => {
  server.middlewares.use((req, res, next) => {
    const relativeIconPath = getRelativeIconPath(req.url, iconsRoutes);

    if (!relativeIconPath) {
      next();
      return;
    }

    const filePath = resolveIconFilePath(relativeIconPath, getAppIconsDir());

    if (!filePath) {
      next();
      return;
    }

    res.setHeader("Content-Type", "image/svg+xml");
    const iconStream = fs.createReadStream(filePath);
    iconStream.on("error", (streamError) => {
      if (res.headersSent) {
        server.config.logger.warn(
          `Failed to serve Pragma icon "${filePath}": ${streamError.message}`,
        );
        res.destroy(streamError);
        return;
      }

      next(streamError);
    });
    iconStream.pipe(res);
  });
};

export const createPragmaIconsPlugin = (rootPath = "/"): Plugin => {
  let root = process.cwd();
  let outDir = "dist";
  const iconsRoute = `${normalizeRootPath(rootPath)}icons/`;
  const iconsRoutes = [...new Set([PRAGMA_ICONS_ROUTE, iconsRoute])];
  const getAppIconsDir = () => path.resolve(root, "src/assets/icons");

  return {
    name: "serve-pragma-icons",
    configResolved(config) {
      ({ root } = config);
      ({ outDir } = config.build);
    },
    configureServer(server) {
      servePragmaIcons(server, iconsRoutes, getAppIconsDir);
    },
    configurePreviewServer(server) {
      servePragmaIcons(server, iconsRoutes, getAppIconsDir);
    },
    generateBundle(_options, bundle) {
      if (iconsRoute === PRAGMA_ICONS_ROUTE) {
        return;
      }

      Object.values(bundle).forEach((output) => {
        if (
          output.type === "asset" &&
          output.fileName.endsWith(".css") &&
          typeof output.source === "string"
        ) {
          output.source = output.source.replaceAll(
            PRAGMA_ICONS_ROUTE,
            iconsRoute,
          );
        }
      });
    },
    writeBundle() {
      const outputIconsDir = path.resolve(root, outDir, "icons");
      fs.cpSync(PRAGMA_ICONS_DIR, outputIconsDir, {
        recursive: true,
        force: true,
      });

      const appIconsDir = getAppIconsDir();
      if (fs.existsSync(appIconsDir)) {
        fs.cpSync(appIconsDir, outputIconsDir, {
          recursive: true,
          force: true,
        });
      }
    },
  };
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    build: {
      // Monaco is lazy-loaded but still produces a large chunk. We can remove this when we stop using Monaco.
      chunkSizeWarningLimit: 4000,
      rolldownOptions: {
        external: /^\/icons\/[^?#]+\.svg(?:#[^?]*)?$/,
      },
    },
    plugins: [
      react(),
      createPragmaIconsPlugin(env.VITE_ROOT_PATH),
      {
        name: "exclude-msw",
        apply: "build",
        closeBundle() {
          const mswPath = path.resolve(
            import.meta.dirname,
            "dist/mockServiceWorker.js",
          );
          if (fs.existsSync(mswPath)) {
            fs.unlinkSync(mswPath);
          }
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "src"),
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
                rewrite: (requestPath) =>
                  requestPath.replace(/^\/debarchive/, ""),
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
