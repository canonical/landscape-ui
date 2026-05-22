import { defineConfig } from "@playwright/test";

const BASE_URL = "http://localhost:5173";

export default defineConfig({
  testDir: "./ui",
  testMatch: "**/*.saas.integration.spec.ts",

  workers: 1,
  fullyParallel: false,
  retries: 1,
  forbidOnly: !!process.env.CI,

  // Reuses the same globalSetup (same backend, same auth flow).
  globalSetup: "./global-setup.ts",

  reporter: [
    ["html", { open: "never", outputFolder: "../../playwright-integration-saas-report" }],
    ["list"],
  ],

  // Starts Vite in e2e.saas mode → loads .env.e2e.saas (VITE_SELF_HOSTED_ENV=false).
  webServer: {
    cwd: "../../",
    command: "vite --mode e2e.saas",
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    video: "retain-on-failure",
    ignoreHTTPSErrors: true,
  },
});
