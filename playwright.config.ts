import { defineConfig, devices } from "@playwright/test";

export const STORAGE_STATE = "playwright/.auth/user.json";

const PORT = process.env.CI ? 4173 : 5173;

const BASE_URL = `http://localhost:${PORT}`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "tests",
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
  /* Start a web server before running the tests. */
  webServer: {
    command: process.env.CI ? "npm run preview" : "npm run dev",
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: BASE_URL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "login",
      testMatch: "login.spec.ts",
    },
    {
      name: "remove-test-distribution-if-present",
      dependencies: ["login"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "removeTestDistributionIfPresent.spec.ts",
    },
    {
      name: "remove-test-repository-profile-if-present",
      dependencies: ["login"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "removeTestRepositoryProfileIfPresent.spec.ts",
    },
    {
      name: "remove-test-gpg-key-if-present",
      dependencies: ["remove-test-distribution-if-present"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "removeTestGpgKeyIfPresent.spec.ts",
    },
    {
      name: "remove-test-apt-source-if-present",
      dependencies: ["remove-test-repository-profile-if-present"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "removeTestAptSourceIfPresent.spec.ts",
    },
    {
      name: "add-gpg-key",
      dependencies: ["remove-test-gpg-key-if-present"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "createGpgKey.spec.ts",
    },
    {
      name: "add-distribution",
      dependencies: ["remove-test-distribution-if-present"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "createDistribution.spec.ts",
    },
    {
      name: "add-mirror-1",
      dependencies: ["add-distribution"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "createMirror1.spec.ts",
    },
    {
      name: "add-mirror-2",
      dependencies: ["add-mirror-1"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "createMirror2.spec.ts",
    },
    {
      name: "add-mirror-3",
      dependencies: ["add-mirror-2"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "createMirror3.spec.ts",
    },
    {
      name: "add-derived-series",
      dependencies: ["add-mirror-3"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "createDerivedSeries.spec.ts",
    },
    {
      name: "add-ubuntu-snapshot",
      dependencies: ["add-derived-series"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "createUbuntuSnapshot.spec.ts",
    },
    {
      name: "add-pocket",
      dependencies: ["add-ubuntu-snapshot"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "createPocket.spec.ts",
    },
    {
      name: "remove-pocket",
      dependencies: ["add-pocket"],
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
      name: "add-apt-source",
      dependencies: ["edit-upload-pocket"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "createAptSource.spec.ts",
    },
    {
      name: "add-repository-profile",
      dependencies: ["add-apt-source"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "createRepositoryProfile.spec.ts",
    },
    {
      name: "edit-repository-profile",
      dependencies: ["add-repository-profile"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "editRepositoryProfile.spec.ts",
    },
    {
      name: "remove-mirror",
      dependencies: ["edit-repository-profile"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "removeMirror.spec.ts",
    },
    {
      name: "delete-gpg-key",
      dependencies: ["remove-mirror"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE_STATE },
      testMatch: "deleteGpgKey.spec.ts",
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
