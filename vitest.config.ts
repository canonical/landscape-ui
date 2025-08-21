import { defineConfig } from "vitest/config";
import { resolve } from "path";
import packageJson from "./package.json";

export default defineConfig({
  test: {
    typecheck: {
      tsconfig: resolve(__dirname, "tsconfig.vitest.json"),
    },
    exclude: [
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
    deps: {
      optimizer: {
        web: {
          enabled: true,
          include: ["@canonical/react-components"],
        },
      },
    },
    pool: "vmForks",
    testTimeout: 30000,
    coverage: {
      provider: "v8",
      reporter: ["cobertura", "json-summary", "html"],
      reportOnFailure: true,
      reportsDirectory: resolve(__dirname, "reports"),
      exclude: [
        "**/tests/**",
        "**/*.config.*",
        "**/types/**",
        "src/**/index.ts",
        "src/**/_data.{ts,tsx}",
        "coverage/**",
        "reports/**",
        "dist/**",
        "**/[.]**",
        "packages/*/test?(s)/**",
        "**/*.d.ts",
        "**/virtual:*",
        "**/__x00__*",
        "**/\x00*",
        "cypress/**",
        "test?(s)/**",
        "test?(-*).?(c|m)[jt]s?(x)",
        "**/*{.,-}{test,spec}.?(c|m)[jt]s?(x)",
        "**/__tests__/**",
        "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
        "**/vitest.{workspace,projects}.[jt]s?(on)",
        "**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}",
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
