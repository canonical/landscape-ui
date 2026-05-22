import { chromium, type FullConfig } from "@playwright/test";
import fs from "fs";
import path from "path";

const STORAGE_STATE_PATH = "e2e/docker-stack/.auth/state.json";
// Must match e2e/docker-stack/playwright.integration.config.ts › use.baseURL; FullConfig is not
// reliably populated when globalSetup runs ahead of webServer startup.
const BASE_URL = "http://localhost:5173";
const API_URL = "http://localhost:9091/api/v2/";
const API_TIMEOUT_MS = 5_000;
const HTTP_SERVER_ERROR_MIN = 500;
const ENV_FILE = ".env.integration.local";
const ARCHIVE_WARM_TIMEOUT_MS = 90_000;
const ARCHIVE_WARM_POLL_MS = 3_000;

// Load local credentials file if present (gitignored). Values already in
// process.env (e.g. from CI) take precedence because override is false.
if (fs.existsSync(ENV_FILE)) {
  process.loadEnvFile(ENV_FILE);
}

export default async function globalSetup(_config: FullConfig): Promise<void> {
  const email = process.env.CI_ADMIN_EMAIL || "john@example.com";
  const password = process.env.CI_ADMIN_PASSWORD || "pwd";

  // Verify the seeded account is reachable before launching a browser.
  let apiReachable = false;
  try {
    const res = await fetch(API_URL, {
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    apiReachable = res.status < HTTP_SERVER_ERROR_MIN;
  } catch {
    // intentional
  }
  if (!apiReachable) {
    throw new Error(
      `Backend API not reachable at ${API_URL}.\n` +
        "Ensure the backend stack is running: see docs/integration-testing.md",
    );
  }

  // Log in once and write storageState so individual tests skip the login flow.
  fs.mkdirSync(path.dirname(STORAGE_STATE_PATH), { recursive: true });

  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ baseURL: BASE_URL });
    const page = await context.newPage();

    await page.goto("/login");

    const form = page.locator('input[name="identifier"]');
    const formVisible = await form.waitFor({ state: "visible", timeout: 10_000 }).then(() => true).catch(() => false);
    if (!formVisible) {
      await page.screenshot({ path: "e2e/docker-stack/.auth/login-debug.png" });
      throw new Error(
        "Login form did not appear at /login.\n" +
          "The password login method may not be enabled. Ensure the backend stack was started\n" +
          "with LANDSCAPE_BOOTSTRAP_SCHEMA_ARGS — see e2e/docker-stack/README.md.",
      );
    }

    await form.fill(email);
    await page.locator('input[name="password"]').fill(password);
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(/overview/, { timeout: 30_000 });

    await context.storageState({ path: STORAGE_STATE_PATH });

    // Warm the ubuntu-archive-info blob cache. On a fresh container the first
    // request triggers an outbound fetch to archive.ubuntu.com and
    // esm.ubuntu.com which can take 10-30 s. Poll until both endpoints return
    // non-empty distribution lists before allowing tests to start, so the
    // AddMirrorForm Distribution select is never still-loading when tests run.
    const meRes = await context.request.get(`${API_URL}me`);
    if (meRes.ok()) {
      const meBody = await meRes.json() as { token?: string };
      if (meBody.token) {
        const bearer = `Bearer ${meBody.token}`;
        const deadline = Date.now() + ARCHIVE_WARM_TIMEOUT_MS;

        const pollUntilReady = async (archiveType: string): Promise<void> => {
          while (Date.now() < deadline) {
            const res = await context.request.get(
              `${API_URL}repository/ubuntu-archive-info`,
              { params: { archive_type: archiveType }, headers: { Authorization: bearer } },
            );
            if (res.ok()) {
              const body = await res.json() as { distributions?: unknown[] };
              if (Array.isArray(body.distributions) && body.distributions.length > 0) {
                return;
              }
            }
            await new Promise((resolve) => setTimeout(resolve, ARCHIVE_WARM_POLL_MS));
          }
          console.warn(`[global-setup] archive-info (${archiveType}) did not return distributions within ${ARCHIVE_WARM_TIMEOUT_MS / 1000}s — tests may see a disabled Distribution select`);
        };

        await Promise.all([
          pollUntilReady("archive"),
          pollUntilReady("ESM"),
        ]);
      }
    }
  } finally {
    await browser.close();
  }
}
