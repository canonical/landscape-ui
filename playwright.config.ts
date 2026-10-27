import { defineConfig, devices } from "@playwright/test";

/**
 * A boolean flag to determine if the tests are running in a CI environment.
 */
const IS_CI = !!process.env.CI;

/**
 * The port for the development server (used in CI).
 */
const DEV_PORT = 5173;

/**
 * The port for the local preview server.
 */
const PREVIEW_PORT = 4173;

/**
 * The port to use for the web server, depending on the environment.
 */
const PORT = IS_CI ? PREVIEW_PORT : DEV_PORT;

/**
 * The base URL for the application being tested.
 */
const BASE_URL = `http://localhost:${PORT}`;

/**
 * The timeout for the web server to start, in milliseconds.
 * Increased to 3 minutes for CI to account for slower startup times.
 */
const WEBSERVER_TIMEOUT = 3 * 60 * 1000;

/**
 * See https://playwright.dev/docs/test-configuration for more details.
 */
export default defineConfig({
  /**
   * The directory where your test files are located.
   */
  testDir: "e2e/features",

  /**
   * Match all Playwright spec files under the feature-first layout.
   */
  testMatch: "**/*.spec.ts",

  /**
   * Run all tests in parallel.
   */
  fullyParallel: true,

  /**
   * Fail the build on CI if you accidentally leave `test.only` in the source code.
   */
  forbidOnly: IS_CI,

  /**
   * Retry failed tests on CI to handle flakiness. No retries for local development.
   */
  retries: IS_CI ? 2 : 0,

  /**
   * Run 4 workers on CI. Every test gets its own browser context and writes
   * to the backend are mocked, so tests are independent; 4 matches the
   * vCPUs of the GitHub-hosted runners that fork PRs fall back to. For local
   * development, it uses the default number of workers.
   */
  workers: IS_CI ? 4 : undefined,

  /**
   * The reporters to use. "html" generates a report of the test results,
   * and "list" provides simple console output.
   * See https://playwright.dev/docs/test-reporters
   */
  reporter: [["html", { open: "never" }], ["list"]],

  webServer: {
    /**
     * CI: Use 'serve' on port 4173 (Production Build)
     * Local: Use 'pnpm dev' on port 5173 (Development Server)
     */
    command: IS_CI ? "pnpm preview" : "pnpm dev",

    /**
     * A URL to poll to determine when the server is ready. This is more
     * reliable than simply waiting for a port to be open.
     */
    url: BASE_URL,

    /**
     * The timeout for the web server to start.
     */
    timeout: WEBSERVER_TIMEOUT,

    /**
     * Do not reuse an existing server in CI. Always start a fresh one.
     */
    reuseExistingServer: !IS_CI,

    /**
     * Pipe the server's stdout and stderr to the console. This is invaluable
     * for debugging server startup issues in your CI logs.
     */
    stdout: "pipe",
    stderr: "pipe",

    env: {
      VITE_ROOT_PATH: "/",
      VITE_MSW_ENABLED: "false",
    },
  },

  use: {
    /**
     * The base URL to use in actions like `await page.goto('/')`.
     */
    baseURL: BASE_URL,

    /**
     * Collect a trace of failed tests on the first retry. This is a powerful
     * debugging tool. See https://playwright.dev/docs/trace-viewer
     */
    trace: "on-first-retry",

    /**
     * Record a video on the first retry of a failed test, like the trace.
     * Recording every run to keep only the failures costs CPU on each test.
     */
    video: "on-first-retry",

    /**
     * Ignore HTTPS errors, which is often necessary for local development servers.
     */
    ignoreHTTPSErrors: true,

    // Disable CORS for the test browser
    launchOptions: {
      args: ["--disable-web-security"],
    },
  },
  projects: [
    /**
     * Logs in once and saves the session for `authenticatedPage` and
     * `staffPage` to reuse; see `e2e/support/auth.setup.ts`.
     */
    {
      name: "setup",
      testDir: "e2e/support",
      testMatch: "auth.setup.ts",
    },
    {
      name: "saas",
      use: { ...devices["Desktop Chrome"] },
      grepInvert: /@self-hosted/,
      dependencies: ["setup"],
    },
    {
      name: "self-hosted",
      use: { ...devices["Desktop Chrome"] },
      grepInvert: /@saas/,
      dependencies: ["setup"],
    },
  ],
});
