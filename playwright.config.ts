import { defineConfig, devices } from "@playwright/test";

const DEV_PORT = 5173;
const PREVIEW_PORT = 4173;

const PORT = process.env.CI ? DEV_PORT : PREVIEW_PORT;

const BASE_URL = `http://localhost:${PORT}`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "e2e/tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [["html", { open: "never" }], ["list"]],
  /* Start a web server before running the tests. */
  webServer: {
    command: process.env.CI ? "npm run preview" : "npm run dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    stderr: "pipe",
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: BASE_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    video: "retain-on-failure",
    ignoreHTTPSErrors: true,
    // headless: true,
  },
  projects: [
    {
      name: "saas",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "saas.spec.ts",
    },
    {
      name: "self-hosted",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "self-hosted.spec.ts",
    },
    {
      name: "standalone",
      use: { ...devices["Desktop Chrome"] },
      testMatch: "standalone.spec.ts",
    },
    {
      name: "common",
      use: { ...devices["Desktop Chrome"] },
      testMatch: [
        "auth/**/*.spec.ts",
        "pages/**/*.spec.ts",
        "components/**/*.spec.ts",
      ],
    },
  ],
});
