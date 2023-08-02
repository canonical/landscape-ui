import { defineConfig, devices } from "@playwright/test";
import * as path from "path";

export const STORAGE_STATE = path.join(__dirname, "playwright/.auth/user.json");

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
      name: "create-distribution",
      dependencies: ["login"],
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
    {
      name: "remove-pocket",
      dependencies: ["create-pocket"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "removePocket.spec.ts",
    },
    {
      name: "edit-mirror-pocket",
      dependencies: ["remove-pocket"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "editMirrorPocket.spec.ts",
    },
    {
      name: "edit-pull-pocket",
      dependencies: ["edit-mirror-pocket"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "editPullPocket.spec.ts",
    },
    {
      name: "edit-upload-pocket",
      dependencies: ["edit-pull-pocket"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "editUploadPocket.spec.ts",
    },
    {
      name: "sync-pocket",
      dependencies: ["edit-upload-pocket"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "syncPocket.spec.ts",
    },
    {
      name: "pull-to-pocket",
      dependencies: ["edit-upload-pocket"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "pullToPocket.spec.ts",
    },
    {
      name: "remove-packages-from-upload-pocket",
      dependencies: ["edit-upload-pocket"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "removePackagesFromUploadPocket.spec.ts",
    },
    {
      name: "create-apt-source",
      dependencies: ["edit-upload-pocket"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "createAptSource.spec.ts",
    },
    {
      name: "handle-gpg-key",
      dependencies: ["edit-upload-pocket"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "handleGpgKey.spec.ts",
    },
    {
      name: "create-repository-profile",
      dependencies: ["create-apt-source"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "createRepositoryProfile.spec.ts",
    },
    {
      name: "edit-repository-profile",
      dependencies: ["create-repository-profile"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "editRepositoryProfile.spec.ts",
    },
    {
      name: "delete-repository-profile",
      dependencies: ["edit-repository-profile"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "deleteRepositoryProfile.spec.ts",
    },
    {
      name: "delete-apt-source",
      dependencies: ["delete-repository-profile"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "deleteAptSource.spec.ts",
    },
    {
      name: "remove-distribution",
      dependencies: ["delete-apt-source"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "removeDistribution.spec.ts",
    },
  ],
});
