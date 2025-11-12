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
 * The root path for the application, defaulting to "/".
 */

const ROOT_PATH = process.env.VITE_ROOT_PATH ?? "/";

/**
 * The base URL for the application being tested.
 */
const BASE_URL = `http://localhost:${PORT}${ROOT_PATH}`;

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
  testDir: "e2e/tests",

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
   * Limit the number of workers on CI to 1. This can significantly improve
   * stability on resource-constrained CI runners by preventing contention.
   * For local development, it uses the default number of workers.
   */
  workers: IS_CI ? 1 : undefined,

  /**
   * The reporters to use. "html" generates a report of the test results,
   * and "list" provides simple console output.
   * See https://playwright.dev/docs/test-reporters
   */
  reporter: [["html", { open: "never" }], ["list"]],

  webServer: {
    /**
     * The command to start the web server. Uses 'preview' for CI after a build,
     * and 'dev' for local development.
     */
    command: IS_CI ? `pnpm preview --base ${ROOT_PATH}` : "pnpm dev",

    /**
     * A URL to poll to determine when the server is ready. This is more
     * reliable than simply waiting for a port to be open.
     */
    url: BASE_URL,

    /**
     * Pass environment variables from the main Playwright
     * process down into the 'pnpm preview' child process.
     */
    env: {
      VITE_ROOT_PATH: ROOT_PATH,
    },

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
     * Record a video of the test run when a test fails.
     */
    video: "retain-on-failure",

    /**
     * Ignore HTTPS errors, which is often necessary for local development servers.
     */
    ignoreHTTPSErrors: true,
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
