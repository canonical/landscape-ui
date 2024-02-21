import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
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
    pool: "vmThreads",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
