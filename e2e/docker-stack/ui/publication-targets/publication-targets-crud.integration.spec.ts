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
 * Tests MUST run in order (workers=1 / serial describe) because each test
 * depends on state left by the previous one. The shared `targetDisplayName`
 * variable tracks the current display name across tests.
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
 * Test 3 deletes the target via the UI. afterAll performs a best-effort API
 * cleanup in case test 3 did not run (e.g. earlier failure).
 */
import { expect, test, type Page, type APIRequestContext } from "@playwright/test";

test.use({ storageState: "e2e/docker-stack/.auth/state.json" });

// ─── shared state ────────────────────────────────────────────────────────────

/** The display name shown in the UI table. Updated by the edit test. */
let targetDisplayName = "";

/** The full resource name assigned by debarchive on creation, e.g. "publicationTargets/uuid". */
let targetResourceName = "";

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
async function dismissWelcomePopup(
  page: Page,
): Promise<void> {
  await page.addInitScript(() => {
    window.localStorage.setItem("_landscape_isWelcomePopupClosed", "true");
  });
}

/** Fetch the landscape v2 JWT for authenticated API calls. */
async function getAuthToken(
  request: APIRequestContext,
): Promise<string> {
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
  test.afterAll(async ({ request }) => {
    // Best-effort cleanup in case test 3 did not run.
    await cleanupTarget(request, targetResourceName);
  });

  test("creates a new S3 publication target via the UI", async ({ page }) => {
    await dismissWelcomePopup(page);
    const uniqueDisplayName = `CI Test Target ${Date.now()}`;
    targetDisplayName = uniqueDisplayName;

    await page.goto("/repositories/publication-targets");
    await page.waitForLoadState("networkidle");

    // Confirm the page loaded correctly.
    await expect(
      page.getByRole("heading", { name: /publication targets/i }),
    ).toBeVisible({ timeout: 15_000 });

    // Open the Add publication target side panel.
    await page.getByRole("button", { name: /add publication target/i }).click();

    // Wait for the side panel heading to appear.
    await expect(
      page.getByRole("heading", { name: /add publication target/i }),
    ).toBeVisible({ timeout: 15_000 });

    // Fill in the display name. Type defaults to S3 — leave it.
    // Use name attribute to disambiguate from "Bucket name" which also matches /name/i.
    await page.locator('[name="displayName"]').fill(uniqueDisplayName);

    // Fill in required S3 fields with placeholder values.
    await page.getByLabel(/region/i).fill("us-east-1");
    await page.getByLabel(/bucket name/i).fill("ci-test-bucket");
    await page.getByLabel(/aws access key id/i).fill("AKIAIOSFODNN7EXAMPLE");
    await page.getByLabel(/aws secret access key/i).fill("wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY");

    // Submit the form. Scope to the aside to avoid hitting the page-level button.
    await page.getByRole("complementary", { name: "Side panel" })
      .getByRole("button", { name: /add publication target/i })
      .click();

    // Wait for the side panel to close.
    await expect(
      page.getByRole("heading", { name: /add publication target/i }),
    ).not.toBeVisible({ timeout: 15_000 });

    // The new target should appear in the table.
    await expect(
      page.getByRole("row").filter({ hasText: uniqueDisplayName }),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("captures the target resource name for afterAll cleanup", async ({
    request,
  }) => {
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
      (t) => t.displayName === targetDisplayName,
    );
    if (created?.name) {
      targetResourceName = created.name;
    }
  });

  test("edits the created target display name", async ({ page }) => {
    await dismissWelcomePopup(page);
    const updatedDisplayName = "CI Test Target Updated";

    await page.goto("/repositories/publication-targets");
    await page.waitForLoadState("networkidle");

    // Find the row for our target.
    const targetRow = page
      .getByRole("row")
      .filter({ hasText: targetDisplayName });
    await expect(targetRow).toBeVisible({ timeout: 15_000 });

    // Open the actions menu for this row.
    // The toggle button has aria-label "{displayName} actions".
    await page
      .getByRole("button", { name: `${targetDisplayName} actions` })
      .click();

    // Click "Edit" in the dropdown.
    // ContextualMenu items render with role="menuitem" — use that role.
    await page
      .getByRole("menuitem", { name: `Edit ${targetDisplayName}` })
      .click();

    // Wait for the Edit side panel to open.
    // Panel heading is "Edit {displayName}".
    await expect(
      page.getByRole("heading", { name: new RegExp(`Edit ${targetDisplayName}`, "i") }),
    ).toBeVisible({ timeout: 15_000 });

    // Update the display name.
    // Use name attribute to disambiguate from other /name/i fields in the form.
    const nameInput = page.locator('[name="displayName"]');
    await nameInput.fill(updatedDisplayName);
    await expect(nameInput).toHaveValue(updatedDisplayName);

    // Submit.
    await page.getByRole("complementary", { name: "Side panel" }).getByRole("button", { name: /save changes/i }).click();

    await expect(page.getByRole("complementary", { name: "Side panel" })).not.toBeVisible({ timeout: 15_000 });

    // The updated name should appear in the table.
    await expect(
      page.getByRole("row").filter({ hasText: updatedDisplayName }),
    ).toBeVisible({ timeout: 15_000 });

    // Update shared state for the next test.
    targetDisplayName = updatedDisplayName;
  });

  test("deletes the created target", async ({ page }) => {
    await dismissWelcomePopup(page);
    await page.goto("/repositories/publication-targets");
    await page.waitForLoadState("networkidle");

    // Find the row for our (now-renamed) target.
    const targetRow = page
      .getByRole("row")
      .filter({ hasText: targetDisplayName });
    await expect(targetRow).toBeVisible({ timeout: 15_000 });

    // Open the actions menu.
    await page
      .getByRole("button", { name: `${targetDisplayName} actions` })
      .click();

    // Click "Remove" in the dropdown.
    await page
      .getByRole("menuitem", { name: `Remove ${targetDisplayName}` })
      .click();

    // Wait for the confirmation modal.
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 15_000 });

    // Type the required confirmation text: "remove {displayName}".
    await page
      .getByRole("textbox")
      .fill(`remove ${targetDisplayName}`);

    // Confirm deletion.
    await page.getByRole("button", { name: /remove target/i }).click();

    // The row should disappear.
    await expect(
      page.getByRole("row").filter({ hasText: targetDisplayName }),
    ).not.toBeVisible({ timeout: 15_000 });

    // Mark as cleaned up so afterAll is a no-op.
    targetResourceName = "";
  });
});
