/**
 * Integration test: publication targets CRUD round-trip (self-hosted, real debarchive)
 *
 * WHAT THIS TESTS
 * ───────────────
 * Verifies the full create → edit → delete lifecycle for a publication target
 * against the real debarchive backend. Three concerns are tested in order:
 *
 *   1. Create — the AddPublicationTargetForm submits an S3 target successfully
 *      and the new row appears in the table.
 *
 *   2. Edit — the EditTargetForm updates the display name and the table
 *      reflects the change.
 *
 *   3. Delete — the RemoveTargetModal removes the target and the row
 *      disappears from the table.
 *
 * This spec uses a single test with ordered test.step blocks because each step
 * depends on state created by the previous one (create → edit → delete).
 * Keep workers=1 in the integration Playwright config to avoid backend races.
 *
 * SEEDED DATA
 * ───────────
 * The debarchive-seeder creates "Dev S3 Bucket", "Staging S3 Bucket",
 * "Prod S3 Bucket", and "Swift Store" before tests run. This test creates its
 * own uniquely-named target to avoid collisions with seeded data.
 *
 * AUTH
 * ────
 * The debarchive service uses JWT auth managed transparently by
 * useFetchDebArchive. The storageState from global-setup is sufficient for
 * all UI interactions. Direct API calls in afterAll use the v2 /me endpoint
 * to obtain a bearer token, then call the debarchive API directly.
 *
 * CLEANUP
 * ───────
 * The final step deletes the target via the UI. A finally block performs a
 * best-effort API cleanup in case the delete step did not complete.
 */
import {
  expect,
  test,
  type Page,
  type APIRequestContext,
} from "@playwright/test";

test.use({ storageState: "e2e/docker-stack/.auth/state.json" });

// ─── helpers ─────────────────────────────────────────────────────────────────

interface AuthUser {
  token: string;
  [key: string]: unknown;
}

interface PublicationTarget {
  name: string;
  displayName?: string;
  [key: string]: unknown;
}

interface PublicationTargetListResponse {
  publicationTargets: PublicationTarget[];
  [key: string]: unknown;
}

/** Suppress the first-run welcome modal that otherwise intercepts page clicks. */
async function dismissWelcomePopup(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.localStorage.setItem("_landscape_isWelcomePopupClosed", "true");
  });
}

/** Fetch the landscape v2 JWT for authenticated API calls. */
async function getAuthToken(request: APIRequestContext): Promise<string> {
  const res = await request.get("/api/v2/me");
  expect(res.ok(), `GET /api/v2/me failed: ${res.status()}`).toBe(true);
  const body = (await res.json()) as AuthUser;
  expect(
    typeof body.token,
    "GET /api/v2/me did not return a token — is the session cookie valid?",
  ).toBe("string");
  return body.token;
}

/** Delete a debarchive publication target by resource name if it exists. No-op if not found. */
async function cleanupTarget(
  request: APIRequestContext,
  resourceName: string,
): Promise<void> {
  if (!resourceName) return;

  const token = await getAuthToken(request);

  // Verify the target still exists before attempting deletion.
  const listRes = await request.get("/v1beta1/publicationTargets", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!listRes.ok()) return;

  const body = (await listRes.json()) as PublicationTargetListResponse;
  const exists = (body.publicationTargets ?? []).some(
    (t) => t.name === resourceName,
  );
  if (!exists) return;

  await request.delete(`/v1beta1/${resourceName}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ─── tests ───────────────────────────────────────────────────────────────────

test.describe("publication targets CRUD (real debarchive)", () => {
  test("create, edit, and delete a publication target", async ({
    page,
    request,
  }) => {
    await dismissWelcomePopup(page);

    const createdDisplayName = `CI Test Target ${Date.now()}`;
    const updatedDisplayName = "CI Test Target Updated";
    let currentDisplayName = createdDisplayName;
    let targetResourceName = "";

    try {
      await test.step("create target via UI", async () => {
        await page.goto("/repositories/publication-targets");
        await page.waitForLoadState("networkidle");

        await expect(
          page.getByRole("heading", { name: /publication targets/i }),
        ).toBeVisible({ timeout: 15_000 });

        await page
          .getByRole("button", { name: /add publication target/i })
          .click();

        await expect(
          page.getByRole("heading", { name: /add publication target/i }),
        ).toBeVisible({ timeout: 15_000 });

        await page.locator('[name="displayName"]').fill(createdDisplayName);
        await page.getByLabel(/region/i).fill("us-east-1");
        await page.getByLabel(/bucket name/i).fill("ci-test-bucket");
        await page
          .getByLabel(/aws access key id/i)
          .fill("EXAMPLE_ACCESS_KEY_ID");
        await page
          .getByLabel(/aws secret access key/i)
          .fill("EXAMPLE_SECRET_ACCESS_KEY");

        await page
          .getByRole("complementary", { name: "Side panel" })
          .getByRole("button", { name: /add publication target/i })
          .click();

        await expect(
          page.getByRole("heading", { name: /add publication target/i }),
        ).not.toBeVisible({ timeout: 15_000 });

        await expect(
          page.getByRole("row").filter({ hasText: createdDisplayName }),
        ).toBeVisible({ timeout: 15_000 });
      });

      await test.step("capture resource name for cleanup", async () => {
        const token = await getAuthToken(request);
        const listRes = await request.get("/v1beta1/publicationTargets", {
          headers: { Authorization: `Bearer ${token}` },
        });

        expect(
          listRes.ok(),
          `GET /v1beta1/publicationTargets failed: ${listRes.status()}`,
        ).toBe(true);

        const body = (await listRes.json()) as PublicationTargetListResponse;
        const created = (body.publicationTargets ?? []).find(
          (t) => t.displayName === createdDisplayName,
        );

        expect(
          created?.name,
          "Created publication target was not found in API list",
        ).toBeTruthy();

        targetResourceName = created?.name ?? "";
      });

      await test.step("edit target via UI", async () => {
        await page.goto("/repositories/publication-targets");
        await page.waitForLoadState("networkidle");

        const targetRow = page
          .getByRole("row")
          .filter({ hasText: currentDisplayName });
        await expect(targetRow).toBeVisible({ timeout: 15_000 });

        await page
          .getByRole("button", { name: `${currentDisplayName} actions` })
          .click();
        await page
          .getByRole("menuitem", { name: `Edit ${currentDisplayName}` })
          .click();

        await expect(
          page.getByRole("heading", {
            name: new RegExp(`Edit ${currentDisplayName}`, "i"),
          }),
        ).toBeVisible({ timeout: 15_000 });

        const nameInput = page.locator('[name="displayName"]');
        await nameInput.fill(updatedDisplayName);
        await expect(nameInput).toHaveValue(updatedDisplayName);

        await page
          .getByRole("complementary", { name: "Side panel" })
          .getByRole("button", { name: /save changes/i })
          .click();

        await expect(
          page.getByRole("complementary", { name: "Side panel" }),
        ).not.toBeVisible({ timeout: 15_000 });

        await expect(
          page.getByRole("row").filter({ hasText: updatedDisplayName }),
        ).toBeVisible({ timeout: 15_000 });

        currentDisplayName = updatedDisplayName;
      });

      await test.step("delete target via UI", async () => {
        await page.goto("/repositories/publication-targets");
        await page.waitForLoadState("networkidle");

        const targetRow = page
          .getByRole("row")
          .filter({ hasText: currentDisplayName });
        await expect(targetRow).toBeVisible({ timeout: 15_000 });

        await page
          .getByRole("button", { name: `${currentDisplayName} actions` })
          .click();
        await page
          .getByRole("menuitem", { name: `Remove ${currentDisplayName}` })
          .click();

        await expect(page.getByRole("dialog")).toBeVisible({ timeout: 15_000 });

        await page.getByRole("textbox").fill(`remove ${currentDisplayName}`);
        await page.getByRole("button", { name: /remove target/i }).click();

        await expect(
          page.getByRole("row").filter({ hasText: currentDisplayName }),
        ).not.toBeVisible({ timeout: 15_000 });

        // Keep targetResourceName set for finally cleanup (no-op if already deleted).
      });
    } finally {
      // Best-effort cleanup in case delete step did not complete.
      if (!targetResourceName) {
        try {
          const token = await getAuthToken(request);
          const listRes = await request.get("/v1beta1/publicationTargets", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (listRes.ok()) {
            const body = (await listRes.json()) as PublicationTargetListResponse;
            targetResourceName =
              (body.publicationTargets ?? []).find(
                (t) => t.displayName === createdDisplayName,
              )?.name ?? "";
          }
        } catch {
          // best-effort cleanup only
        }
      }

      await cleanupTarget(request, targetResourceName);
    }
  });
});
