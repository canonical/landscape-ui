import fs from "fs";
import { createRequire } from "module";
import * as path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import type { CSSOptions, Plugin, PreviewServer, ViteDevServer } from "vite";

const require = createRequire(import.meta.url);
const PRAGMA_ICONS_ROUTE = "/icons/";
const PRAGMA_ICONS_DIR = path.join(
  path.dirname(require.resolve("@canonical/ds-assets/package.json")),
  "icons",
);

const getRelativeIconPath = (requestUrl: string | undefined) => {
  const { pathname } = new URL(requestUrl ?? "", "http://localhost");

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

  return iconPath;
};

const resolveIconFilePath = async (iconPath: string, appIconsDir: string) => {
  const candidates = [
    path.join(appIconsDir, iconPath),
    path.join(PRAGMA_ICONS_DIR, iconPath),
  ];

  // Sequential: an application icon must win before Pragma's is looked at.
  for (const candidate of candidates) {
    try {
      if ((await fs.promises.stat(candidate)).isFile()) {
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
  getAppIconsDir: () => string,
) => {
  server.middlewares.use((req, res, next) => {
    const relativeIconPath = getRelativeIconPath(req.url);

    if (!relativeIconPath) {
      next();
      return;
    }

    resolveIconFilePath(relativeIconPath, getAppIconsDir())
      .then((filePath) => {
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
      })
      .catch(next);
  });
};

export const createPragmaIconsPlugin = (): Plugin => {
  let root = process.cwd();
  let outDir = "dist";
  const getAppIconsDir = () => path.resolve(root, "src/assets/icons");

  return {
    name: "serve-pragma-icons",
    configResolved(config) {
      ({ root } = config);
      ({ outDir } = config.build);
    },
    configureServer(server) {
      servePragmaIcons(server, getAppIconsDir);
    },
    configurePreviewServer(server) {
      servePragmaIcons(server, getAppIconsDir);
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

type PostcssPlugin = Extract<
  NonNullable<
    Exclude<NonNullable<CSSOptions["postcss"]>, string>["plugins"]
  >[number],
  { postcssPlugin: string }
>;

// Vanilla-era CSS imported from JavaScript never passes through `index.scss`,
// so it is moved into the `vanilla` layer here. Unlayered CSS would outrank
// every Pragma layer, including the adapter's boundary.
const VANILLA_ERA_CSS = [
  /\/@canonical\/react-components\/dist\/.*\.s?css(\?|$)/,
  /\.module\.s?css(\?|$)/,
];

// Top-level layer blocks (such as `@layer app` for rules on Pragma elements)
// keep their own layer.
const KEEP_OUTSIDE_VANILLA_LAYER = new Set(["charset", "import", "layer"]);

export const vanillaLayerPlugin: PostcssPlugin = {
  postcssPlugin: "landscape-vanilla-layer",
  OnceExit(root, { AtRule }) {
    const file = root.source?.input.file ?? "";

    if (!VANILLA_ERA_CSS.some((pattern) => pattern.test(file))) {
      return;
    }

    const nodes = root.nodes.filter(
      (node) =>
        node.type !== "atrule" || !KEEP_OUTSIDE_VANILLA_LAYER.has(node.name),
    );

    if (nodes.length === 0) {
      return;
    }

    const layer = new AtRule({ name: "layer", params: "vanilla" });
    layer.append(nodes);
    // Appended, not prepended: `@charset` and `@import` must stay first, and a
    // trailing `@charset` loses its semicolon, which breaks Vite's build-time
    // `@charset` hoisting when module CSS is concatenated into a chunk.
    root.append(layer);
  },
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
      createPragmaIconsPlugin(),
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
      postcss: {
        plugins: [vanillaLayerPlugin],
      },
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
              // An empty key would match every request, including index.html.
              ...(debArchivePath && {
                [debArchivePath]: {
                  target:
                    env.VITE_API_DEBARCHIVE_PROXY_TARGET ||
                    "http://localhost:8000",
                  changeOrigin: true,
                  secure: false,
                },
              }),
            };
          })()),
      },
    },
  };
});
