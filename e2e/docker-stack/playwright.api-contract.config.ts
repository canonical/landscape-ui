import { defineConfig } from "@playwright/test";

const BASE_URL = "http://localhost:5173";

export default defineConfig({
  testDir: "./api",
  testMatch: "**/*.spec.ts",

  workers: 1,
  fullyParallel: false,
  retries: 1,
  forbidOnly: !!process.env.CI,

  globalSetup: "./global-setup.ts",

  reporter: [["html", { open: "never", outputFolder: "../../playwright-api-contract-report" }], ["list"]],

  // Starts Vite in e2e.selfHosted mode → loads .env.e2e.selfHosted to proxy
  // requests so tests can share the exact same UI session cookie natively.
  webServer: {
    cwd: "../../",
    command: "vite --mode e2e.selfHosted",
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    video: "retain-on-failure",
    ignoreHTTPSErrors: true,
    storageState: "e2e/docker-stack/.auth/state.json",
  },
});
