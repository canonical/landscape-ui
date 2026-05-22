import { defineConfig } from "@playwright/test";

const BASE_URL = "http://localhost:5173";

export default defineConfig({
  testDir: "./ui",
  testMatch: "**/*.integration.spec.ts",
  // SaaS-mode tests use a different Vite server mode and must run separately.
  // Exclude them here so self-hosted mode doesn't try to run them (they would
  // fail because VITE_SELF_HOSTED_ENV=true and routes don't redirect).
  testIgnore: "**/*.saas.integration.spec.ts",

  // Shared backend is mutable; read-only tests only in Phase 1
  workers: 1,
  fullyParallel: false,
  retries: 1,
  forbidOnly: !!process.env.CI,

  globalSetup: "./global-setup.ts",

  reporter: [["html", { open: "never", outputFolder: "../../playwright-integration-report" }], ["list"]],

  // Playwright manages the dev server lifecycle.
  // No build step required — the Vite dev proxy routes /api → localhost:9091
  // so cookies are same-origin and session auth persists across navigations.
  // Starts Vite in e2e.selfHosted mode → loads .env.e2e.selfHosted (VITE_SELF_HOSTED_ENV=true).
  webServer: {
    cwd: "../../",
    command: "vite --mode e2e.selfHosted",
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
