import { readFileSync } from "fs";
import { resolve } from "path";
import { defineConfig } from "vitest/config";
import packageJson from "./package.json" with { type: "json" };

// Strip Vite's query suffix (e.g. "?v=hash") from a module id to get a real path.
const cleanUrl = (id: string) => id.replace(/[?#].*$/, "");

const viteIdToFilePath = (id: string) => cleanUrl(id).replace(/^\/@fs\//, "");

export default defineConfig({
  test: {
    exclude: [
      "**/e2e/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,tests,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
    ],
    environment: "jsdom",
    globals: true,
    globalSetup: [resolve(import.meta.dirname, "src/tests/global-setup.ts")],
    setupFiles: [resolve(import.meta.dirname, "src/tests/setup.ts")],
    alias: [
      {
        find: /^.*\.(css|scss|sass)$/,
        replacement: resolve(import.meta.dirname, "src/tests/styleMock.ts"),
      },
      {
        find: "@/components/form/CodeEditor",
        replacement: resolve(import.meta.dirname, "src/tests/monacoMock.tsx"),
      },
      {
        find: "@monaco-editor/react",
        replacement: resolve(import.meta.dirname, "src/tests/monacoMock.tsx"),
      },
      {
        find: "@",
        replacement: resolve(import.meta.dirname, "src"),
      },
    ],
    pool: "threads",
    testTimeout: 30000,
    server: {
      deps: {
        // Inline the Pragma barrel so Vite (not Node) transforms it: this lets
        // the CSS -> styleMock alias catch the ".css" side-effect imports its
        // _work_in_progress components pull in. Without this, Node's native ESM
        // loader hits those CSS files and throws "Unknown file extension .css".
        // Anchored to the package boundary so it does not also match the future
        // @canonical/react-ds-global-form (Track A3).
        inline: [/@canonical\/react-ds-global(\/|$)/],
      },
    },
    coverage: {
      provider: "v8",
      reporter: ["cobertura", "json-summary", "html"],
      reportOnFailure: true,
      reportsDirectory: resolve(import.meta.dirname, "reports"),
      thresholds: {
        statements: 80,
        lines: 80,
        functions: 80,
        branches: 70,
      },
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "**/tests/**",
        "**/*.config.*",
        "**/types/**",
        "**/index.ts",
        "**/_data.{ts,tsx}",
        "**/[.]**",
        "**/*.d.ts",
        "**/virtual:*",
        "**/__x00__*",
        "**/*{.,-}{test,spec}.{ts,tsx}",
        "**/__tests__/**",
        "**/vitest.{workspace,projects}.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "src"),
    },
  },
  plugins: [
    {
      // @canonical/react-ds-global's sourcemaps point to unpublished src/ paths.
      // Strip them and return an empty map to silence Vite's "missing source" test warnings.
      name: "strip-pragma-sourcemaps",
      enforce: "pre",
      load(id) {
        const filePath = viteIdToFilePath(id);
        if (
          !filePath.includes("@canonical/react-ds-global/") ||
          !/\.m?jsx?$/.test(filePath)
        ) {
          return null;
        }
        let original: string;
        try {
          original = readFileSync(filePath, "utf-8");
        } catch {
          return null;
        }
        const code = original.replace(/\r?\n?\/\/# sourceMappingURL=\S+/g, "");
        if (code === original) {
          return null;
        }
        return {
          code,
          map: { version: 3, sources: [], names: [], mappings: "" },
        };
      },
    },
  ],
  define: {
    __APP_VERSION__: JSON.stringify(packageJson.version),
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
      },
    },
  },
});
