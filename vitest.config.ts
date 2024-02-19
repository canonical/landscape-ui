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
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
    ],
    watchExclude: ["**/tests/**", "**/node_modules/**", "**/dist/**"],
    environment: "jsdom",
    globals: true,
    setupFiles: [resolve(__dirname, "vitest/setup.ts")],
  },
});
