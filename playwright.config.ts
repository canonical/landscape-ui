import { defineConfig, devices } from "@playwright/test";
import * as path from "path";

export const STORAGE_STATE = path.join(__dirname, "playwright/.auth/user.json");

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://127.0.0.1:5173",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "login",
      testMatch: "login.spec.ts",
    },
    {
      name: "remove-distribution",
      dependencies: ["login"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "removeDistribution.spec.ts",
    },
    {
      name: "create-distribution",
      dependencies: ["remove-distribution"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "createDistribution.spec.ts",
    },
    {
      name: "create-mirror-1",
      dependencies: ["create-distribution"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "createMirror1.spec.ts",
    },
    {
      name: "create-mirror-2",
      dependencies: ["create-mirror-1"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "createMirror2.spec.ts",
    },
    {
      name: "create-mirror-3",
      dependencies: ["create-mirror-2"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "createMirror3.spec.ts",
    },
    {
      name: "create-snapshot",
      dependencies: ["create-mirror-3"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "createSnapshot.spec.ts",
    },
    {
      name: "remove-mirror",
      dependencies: ["create-snapshot"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "removeMirror.spec.ts",
    },
    {
      name: "create-pocket",
      dependencies: ["remove-mirror"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "createPocket.spec.ts",
    },

    /* Configure projects for major browsers */
    // {
    //   name: "chromium",
    //   use: { ...devices["Desktop Chrome"] },
    // },
    //
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    //
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
