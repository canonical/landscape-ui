/**
 * Integration test: mirrors CRUD round-trip (self-hosted, real debarchive)
 *
 * WHAT THIS TESTS
 * ───────────────
 * Verifies the full create → edit → delete lifecycle for a mirror against the
 * real debarchive backend. Three concerns are tested in order:
 *
 *   1. Create — the AddMirrorForm submits successfully and the new mirror
 *      appears in the table.
 *
 *   2. Edit — the EditMirrorForm updates the display name and the table
 *      reflects the change.
 *
 *   3. Delete — the RemoveMirrorModal removes the mirror and the row
 *      disappears from the table.
 *
 * Tests MUST run in order (--workers=1 or serial describe) because each test
 * depends on state left by the previous one. The shared `mirrorDisplayName`
 * variable tracks the current display name across tests.
 *
 * SEEDED DATA
 * ───────────
 * The debarchive-seeder creates "Ubuntu Noble Main" and "Ubuntu Jammy Main"
 * before tests run. This test creates its own uniquely-named mirror to avoid
 * collisions with seeded data.
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
 * Test 3 deletes the mirror via the UI. afterAll performs a best-effort API
 * cleanup in case test 3 did not run (e.g. earlier failure).
 */
import { expect, test, type Page, type APIRequestContext } from "@playwright/test";

test.use({ storageState: "e2e/docker-stack/.auth/state.json" });

// ─── shared state ────────────────────────────────────────────────────────────

/** The display name shown in the UI table. Updated by the edit test. */
let mirrorDisplayName = "";

/** The API slug (name) assigned by debarchive on creation. */
let mirrorName = "";

// ─── helpers ─────────────────────────────────────────────────────────────────

interface AuthUser {
  token: string;
  [key: string]: unknown;
}

interface DebarchiveMirror {
  name: string;
  displayName: string;
  [key: string]: unknown;
}

interface DebarchiveMirrorList {
  results: DebarchiveMirror[];
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

/** Delete a debarchive mirror by slug if it exists. No-op if not found. */
async function cleanupMirror(
  request: APIRequestContext,
  slug: string,
): Promise<void> {
  if (!slug) return;

  const token = await getAuthToken(request);

  // Verify the mirror still exists before attempting deletion.
  const listRes = await request.get("/v1beta1/mirrors", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!listRes.ok()) return;

  const body = (await listRes.json()) as DebarchiveMirrorList;
  const exists = body.results?.some((m) => m.name === slug);
  if (!exists) return;

  await request.delete(`/v1beta1/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ─── tests ───────────────────────────────────────────────────────────────────

test.describe.serial("mirrors CRUD (real debarchive)", () => {
  test.afterAll(async ({ request }) => {
    // Best-effort cleanup in case test 3 did not run.
    await cleanupMirror(request, mirrorName);
  });

  test("creates a new mirror via the UI", async ({ page }) => {
    await dismissWelcomePopup(page);
    const uniqueDisplayName = `CI Test Mirror ${Date.now()}`;
    mirrorDisplayName = uniqueDisplayName;

    await page.goto("/repositories/mirrors");
    await page.waitForLoadState("networkidle");

    // Confirm the page loaded correctly.
    await expect(
      page.getByRole("heading", { name: /mirrors/i }),
    ).toBeVisible({ timeout: 15_000 });

    // Open the Add mirror side panel.
    await page.getByRole("button", { name: "Add mirror" }).click();

    // Wait for the side panel heading to appear.
    await expect(
      page.getByRole("heading", { name: /add mirror/i }),
    ).toBeVisible({ timeout: 15_000 });

    // Fill in the display name.
    await page.getByLabel("Name").fill(uniqueDisplayName);

    // Source type defaults to "Ubuntu archive" — leave it as-is.
    // Wait for the Mirror contents block to load (Distribution select populated).
    await expect(page.getByLabel("Distribution")).not.toBeDisabled({
      timeout: 60_000,
    });

    // Distribution, components, and architectures auto-populate with defaults.
    // Do not change them.

    // Submit the form.
    await page
      .getByRole("button", { name: "Add mirror" })
      .last()
      .click();

    // Wait for the side panel to close.
    await expect(
      page.getByRole("heading", { name: /add mirror/i }),
    ).not.toBeVisible({ timeout: 15_000 });

    // The new mirror should appear in the table.
    await expect(
      page.getByRole("row").filter({ hasText: uniqueDisplayName }),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("captures the mirror slug for afterAll cleanup", async ({ request }) => {
    const token = await getAuthToken(request);
    const listRes = await request.get("/v1beta1/mirrors", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(listRes.ok(), `GET /v1beta1/mirrors failed: ${listRes.status()}`).toBe(true);
    const body = (await listRes.json()) as DebarchiveMirrorList;
    const created = body.results?.find((m) => m.displayName === mirrorDisplayName);
    if (created?.name) {
      mirrorName = created.name;
    }
  });

  test("edits the created mirror display name", async ({ page }) => {
    await dismissWelcomePopup(page);
    const updatedDisplayName = "CI Test Mirror Updated";

    await page.goto("/repositories/mirrors");
    await page.waitForLoadState("networkidle");

    // Find the row for our mirror.
    const mirrorRow = page
      .getByRole("row")
      .filter({ hasText: mirrorDisplayName });
    await expect(mirrorRow).toBeVisible({ timeout: 15_000 });

    // Open the actions menu for this row (contextual-menu toggle button).
    await mirrorRow.getByRole("button").last().click();

    // Click "Edit" in the dropdown.
    // ContextualMenu items render with role="menuitem" (not "button") — use that role.
    await page.getByRole("menuitem", { name: "Edit" }).click();

    // Wait for the Edit side panel to open.
    await expect(
      page.getByRole("heading", { name: /edit/i }),
    ).toBeVisible({ timeout: 15_000 });

    // Update the display name.
    const nameInput = page.getByRole("complementary", { name: "Side panel" }).getByLabel("Name");
    await nameInput.fill(updatedDisplayName);
    // Confirm Formik has processed the change before submitting.
    await expect(nameInput).toHaveValue(updatedDisplayName);

    // Submit.
    await page.getByRole("complementary", { name: "Side panel" }).getByRole("button", { name: "Save changes" }).click();

    // Wait for the side panel to close.
    await expect(page.getByRole("complementary", { name: "Side panel" })).not.toBeVisible({ timeout: 15_000 });

    // The updated name should appear in the table.
    await expect(
      page.getByRole("row").filter({ hasText: updatedDisplayName }),
    ).toBeVisible({ timeout: 15_000 });

    // Update shared state for the next test.
    mirrorDisplayName = updatedDisplayName;
  });

  test("deletes the created mirror", async ({ page }) => {
    await dismissWelcomePopup(page);
    await page.goto("/repositories/mirrors");
    await page.waitForLoadState("networkidle");

    // Find the row for our (now-renamed) mirror.
    const mirrorRow = page
      .getByRole("row")
      .filter({ hasText: mirrorDisplayName });
    await expect(mirrorRow).toBeVisible({ timeout: 15_000 });

    // Open the actions menu.
    await mirrorRow.getByRole("button").last().click();

    // Click "Remove" in the dropdown.
    // ContextualMenu items render with role="menuitem" (not "button") — use that role.
    await page.getByRole("menuitem", { name: "Remove" }).click();

    // Wait for the confirmation modal.
    await expect(
      page.getByRole("dialog"),
    ).toBeVisible({ timeout: 15_000 });

    // Type the confirmation text.
    await page
      .getByRole("textbox")
      .fill(`remove ${mirrorDisplayName}`);

    // Confirm deletion.
    await page.getByRole("button", { name: "Remove mirror" }).click();

    // The row should disappear.
    await expect(
      page.getByRole("row").filter({ hasText: mirrorDisplayName }),
    ).not.toBeVisible({ timeout: 15_000 });

    // Mark as cleaned up so afterAll is a no-op.
    mirrorName = "";
  });
});
