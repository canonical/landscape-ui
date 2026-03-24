import { resolve } from "path";
import { defineConfig } from "vitest/config";
import packageJson from "./package.json";

export default defineConfig({
  test: {
    exclude: [
      "**/e2e/**",
      "**/tests/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,tests,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
    ],
    environment: "jsdom",
    globals: true,
    setupFiles: [resolve(__dirname, "src/tests/setup.ts")],
    alias: [
      {
        find: /^.*\.(css|scss|sass)$/,
        replacement: resolve(__dirname, "src/tests/styleMock.ts"),
      },
      {
        find: "@/components/form/CodeEditor",
        replacement: resolve(__dirname, "src/tests/monacoMock.tsx"),
      },
      {
        find: "@monaco-editor/react",
        replacement: resolve(__dirname, "src/tests/monacoMock.tsx"),
      },
      {
        find: "@",
        replacement: resolve(__dirname, "src"),
      },
    ],
    deps: {
      optimizer: {
        client: {
          enabled: true,
          include: ["@canonical/react-components"],
        },
      },
    },
    pool: "threads",
    testTimeout: 30000,
    coverage: {
      provider: "v8",
      reporter: ["cobertura", "json-summary", "html"],
      reportOnFailure: true,
      reportsDirectory: resolve(__dirname, "reports"),
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
      "@": resolve(__dirname, "src"),
    },
  },
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
