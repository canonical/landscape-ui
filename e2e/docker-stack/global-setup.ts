import { chromium, type FullConfig } from "@playwright/test";
import fs from "fs";
import path from "path";

const STORAGE_STATE_PATH = "e2e/docker-stack/.auth/state.json";
// Must match e2e/docker-stack/playwright.integration.config.ts › use.baseURL; FullConfig is not
// reliably populated when globalSetup runs ahead of webServer startup.
const BASE_URL = "http://localhost:5173";
const API_URL = "http://localhost:9091/api/v2/";
const API_TIMEOUT_MS = 5_000;
const ENV_FILE = ".env.integration.local";
const ARCHIVE_WARM_TIMEOUT_MS = 90_000;
const ARCHIVE_WARM_POLL_MS = 3_000;
const BODY_PREVIEW_CHARS = 500;

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
  const healthUrl = `${API_URL}login/methods`;
  try {
    const res = await fetch(healthUrl, {
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    apiReachable = res.ok;
  } catch {
    // intentional
  }
  if (!apiReachable) {
    throw new Error(
      `Backend API not reachable at ${healthUrl}.\n` +
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
    const formVisible = await form
      .waitFor({ state: "visible", timeout: 10_000 })
      .then(() => true)
      .catch(() => false);
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

    // Bake the welcome-modal dismissal into the shared storageState so every
    // spec reusing it skips the first-run popup without repeating this call.
    await page.evaluate(() => {
      window.localStorage.setItem("_landscape_isWelcomePopupClosed", "true");
    });

    await context.storageState({ path: STORAGE_STATE_PATH });

    // Warm the Ubuntu archive-info blob cache. The mirror CRUD test needs a
    // populated Ubuntu archive distribution selector before it begins.
    const meRes = await context.request.get(`${API_URL}me`);
    if (meRes.ok()) {
      const meBody = (await meRes.json()) as { token?: string };
      if (meBody.token) {
        const bearer = `Bearer ${meBody.token}`;
        const startedAt = Date.now();
        const deadline = startedAt + ARCHIVE_WARM_TIMEOUT_MS;

        const pollUntilReady = async (archiveType: string): Promise<void> => {
          // Tracks the last observed response so a timeout error can explain
          // *why* the archive wasn't ready (e.g. 5xx vs empty payload) instead
          // of just "gave up after 90s".
          let lastStatus: number | string = "no response received";
          let lastBodySummary = "n/a";

          while (Date.now() < deadline) {
            let res;
            try {
              res = await context.request.get(
                `${API_URL}repository/ubuntu-archive-info`,
                {
                  params: { archive_type: archiveType },
                  headers: { Authorization: bearer },
                },
              );
            } catch (error) {
              lastStatus = "request failed";
              lastBodySummary = String(error);
              await new Promise((resolve) =>
                setTimeout(resolve, ARCHIVE_WARM_POLL_MS),
              );
              continue;
            }

            lastStatus = res.status();
            const rawBody = await res.text();
            lastBodySummary = rawBody.slice(0, BODY_PREVIEW_CHARS);

            if (res.ok()) {
              // "archive" responses carry distributions at the top level;
              // "ESM" responses wrap per-service archives under "results".
              let body: { distributions?: unknown[]; results?: unknown[] };
              try {
                body = JSON.parse(rawBody) as typeof body;
              } catch (error) {
                // A 2xx with a non-JSON body (e.g. proxy/gateway error page)
                // is treated as "not ready yet" so the timeout error below
                // still fires with useful diagnostics instead of a raw parse crash.
                lastBodySummary = `non-JSON response: ${String(error)}`;
                await new Promise((resolve) =>
                  setTimeout(resolve, ARCHIVE_WARM_POLL_MS),
                );
                continue;
              }
              const ready =
                archiveType === "archive"
                  ? Array.isArray(body.distributions) &&
                    body.distributions.length > 0
                  : Array.isArray(body.results) && body.results.length > 0;
              if (ready) {
                return;
              }
            }
            await new Promise((resolve) =>
              setTimeout(resolve, ARCHIVE_WARM_POLL_MS),
            );
          }

          const waitedSeconds = Math.round((Date.now() - startedAt) / 1000);
          throw new Error(
            `[global-setup] archive-info (${archiveType}) did not return distributions within ${ARCHIVE_WARM_TIMEOUT_MS / 1000}s (waited ${waitedSeconds}s).\n` +
              `Last response status: ${lastStatus}\n` +
              `Last response body (truncated): ${lastBodySummary}\n` +
              "This endpoint triggers a live fetch from archive.ubuntu.com/esm.ubuntu.com " +
              "on first request (see generate_and_store_esm_and_archive_infos in " +
              "landscape-server); a slow or blocked upstream network call is the most " +
              "likely cause. Tests were not started.",
          );
        };

        await pollUntilReady("archive");
      }
    }
  } finally {
    await browser.close();
  }
}
