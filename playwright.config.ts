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
    { name: "setup", testMatch: /.*\.setup\.ts/ },
    {
      name: "remove-test-distribution-if-present",
      testMatch: "removeTestDistributionIfPresent.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup"],
    },
    {
      name: "remove-test-repository-profile-if-present",
      testMatch: "removeTestRepositoryProfileIfPresent.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "setup"],
    },
    {
      name: "remove-test-gpg-key-if-present",
      testMatch: "removeTestGpgKeyIfPresent.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "remove-test-distribution-if-present"],
    },
    {
      name: "remove-test-apt-source-if-present",
      testMatch: "removeTestAptSourceIfPresent.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "remove-test-repository-profile-if-present"],
    },
    {
      name: "add-gpg-key",
      testMatch: "createGpgKey.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "remove-test-gpg-key-if-present"],
    },
    {
      name: "add-distribution",
      testMatch: "createDistribution.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "remove-test-distribution-if-present"],
    },
    {
      name: "add-mirror-1",
      testMatch: "createMirror1.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "add-distribution"],
    },
    {
      name: "add-mirror-2",
      testMatch: "createMirror2.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "add-mirror-1"],
    },
    {
      name: "add-mirror-3",
      testMatch: "createMirror3.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "add-mirror-2"],
    },
    {
      name: "add-derived-series",
      dependencies: ["setup", "add-mirror-3"],
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      testMatch: "createDerivedSeries.spec.ts",
    },
    {
      name: "add-ubuntu-snapshot",
      testMatch: "createUbuntuSnapshot.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "add-derived-series"],
    },
    {
      name: "add-pocket",
      testMatch: "createPocket.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "add-ubuntu-snapshot"],
    },
    {
      name: "remove-pocket",
      testMatch: "removePocket.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "add-pocket"],
    },
    {
      name: "edit-mirror-pocket",
      testMatch: "editMirrorPocket.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "remove-pocket"],
    },
    {
      name: "edit-pull-pocket",
      testMatch: "editPullPocket.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "edit-mirror-pocket"],
    },
    {
      name: "edit-upload-pocket",
      testMatch: "editUploadPocket.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "edit-pull-pocket"],
    },
    {
      name: "sync-pocket",
      testMatch: "syncPocket.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "edit-upload-pocket"],
    },
    {
      name: "pull-to-pocket",
      testMatch: "pullToPocket.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "edit-upload-pocket"],
    },
    {
      name: "remove-packages-from-upload-pocket",
      testMatch: "removePackagesFromUploadPocket.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "edit-upload-pocket"],
    },
    {
      name: "add-apt-source",
      testMatch: "createAptSource.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "edit-upload-pocket"],
    },
    {
      name: "add-repository-profile",
      testMatch: "createRepositoryProfile.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "add-apt-source"],
    },
    {
      name: "edit-repository-profile",
      testMatch: "editRepositoryProfile.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "add-repository-profile"],
    },
    {
      name: "remove-mirror",
      testMatch: "removeMirror.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "edit-repository-profile"],
    },
    {
      name: "delete-gpg-key",
      testMatch: "deleteGpgKey.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "remove-mirror"],
    },
    {
      name: "delete-repository-profile",
      testMatch: "deleteRepositoryProfile.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "edit-repository-profile"],
    },
    {
      name: "delete-apt-source",
      testMatch: "deleteAptSource.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "delete-repository-profile"],
    },
    {
      name: "remove-distribution",
      testMatch: "removeDistribution.spec.ts",
      use: { ...devices["Desktop Firefox"], storageState: STORAGE_STATE },
      dependencies: ["setup", "delete-apt-source"],
    },
  ],
});
