/**
 * Integration test: repository mirrors page (self-hosted)
 *
 * WHAT THIS TESTS
 * ───────────────
 * Verifies that the mirrors page functions correctly against the real debarchive
 * backend. Two concerns are tested:
 *
 *   1. The page renders in self-hosted mode — navigating to /repositories/mirrors
 *      does NOT redirect to /env-error. This is the integration-level equivalent
 *      of the mocked @self-hosted test in e2e/features/repositories/mirrors.spec.ts.
 *
 *   2. Real API data renders — seeded mirrors ("Ubuntu Noble Main", "Ubuntu Jammy Main")
 *      are fetched from the debarchive service (GET /v1beta1/mirrors) and appear in
 *      the table. This goes beyond what the mocked test can verify.
 *
 * The mirrors page calls the debarchive service via the Vite proxy
 * (VITE_API_DEBARCHIVE_PROXY_TARGET → http://localhost:8000). Seeded data is
 * created by the debarchive-seeder container before tests run.
 *
 * SIDEBAR
 * ───────
 * The "Repositories" section must be visible in the sidebar in self-hosted mode.
 * In SaaS mode it is hidden entirely; this test confirms it is present and
 * navigable. See saas-guards.saas.integration.spec.ts for the SaaS equivalent.
 *
 * AUTH
 * ────
 * The debarchive service uses JWT auth managed transparently by useFetchDebArchive.
 * The storageState from global-setup is sufficient.
 */
import { expect, test } from "@playwright/test";

test.use({ storageState: "e2e/docker-stack/.auth/state.json" });

const SEEDED_MIRRORS = ["Ubuntu Noble Main", "Ubuntu Jammy Main"];

test.describe("mirrors page (self-hosted, real debarchive)", () => {
  test("page renders without redirecting to /env-error", async ({ page }) => {
    await page.goto("/repositories/mirrors");
    await page.waitForLoadState("networkidle");

    // Confirm the route resolved correctly — not redirected to env-error.
    await expect(page).not.toHaveURL(/\/env-error/);
    await expect(
      page.getByRole("heading", { name: /mirrors/i }),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("sidebar shows Repositories section in self-hosted mode", async ({
    page,
  }) => {
    await page.goto("/overview");
    await page.waitForLoadState("networkidle");

    // The Repositories nav item must be present in the sidebar.
    await expect(
      page.getByRole("navigation").getByText("Repositories"),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("seeded mirrors are listed from the real debarchive API", async ({
    page,
  }) => {
    await page.goto("/repositories/mirrors");
    await expect(page.getByRole("main")).toBeVisible();
    await page.waitForLoadState("networkidle");

    for (const name of SEEDED_MIRRORS) {
      await expect(
        page.getByRole("row").filter({ hasText: name }),
        `Expected seeded mirror "${name}" to appear in the table`,
      ).toBeVisible({ timeout: 15_000 });
    }
  });
});
