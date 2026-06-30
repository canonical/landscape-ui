/**
 * Integration test: publication targets (debarchive service)
 *
 * WHAT THIS TESTS
 * ───────────────
 * Verifies that the debarchive service is reachable and that seed data created
 * by the debarchive-seeder container (4 publication targets: "Dev S3 Bucket",
 * "Staging S3 Bucket", "Prod S3 Bucket", "Swift Store") is visible in the UI.
 *
 * The publication targets page calls GET /v1beta1/publicationTargets via the
 * Vite dev proxy (VITE_API_DEBARCHIVE_PROXY_TARGET → http://localhost:8000).
 * This exercises the full request path: React → useFetchDebArchive → Vite proxy
 * → landscape-debarchive container.
 *
 * AUTH
 * ────
 * The debarchive service uses its own JWT auth (not the Landscape session
 * cookie). The UI's useFetchDebArchive hook manages this transparently, so the
 * storageState from global-setup is sufficient.
 */
import { expect, test } from "@playwright/test";

test.use({ storageState: "e2e/docker-stack/.auth/state.json" });

const SEEDED_TARGETS = [
  "Dev S3 Bucket",
  "Staging S3 Bucket",
  "Prod S3 Bucket",
  "Swift Store",
];

test.describe("publication targets page (debarchive)", () => {
  test("seeded publication targets are listed", async ({ page }) => {
    await page.goto("/repositories/publication-targets");
    await expect(page.getByRole("main")).toBeVisible();
    await page.waitForLoadState("networkidle");

    for (const name of SEEDED_TARGETS) {
      await expect(
        page.getByRole("row").filter({ hasText: name }),
        `Expected seeded target "${name}" to appear in the table`,
      ).toBeVisible({ timeout: 15_000 });
    }
  });
});
