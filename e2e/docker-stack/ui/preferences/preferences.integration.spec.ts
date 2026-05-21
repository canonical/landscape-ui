/**
 * Integration test: organisation-preferences mutation round-trip
 *
 * WHY NOT TAGS
 * ─────────────
 * The v2 GET /api/v2/tags endpoint returns tag strings that already exist on
 * registered computers. In a fresh environment (seeded admin account only, no
 * registered instances) there are no computers to tag, so there is no way to
 * create a tag through the tags API surface. The only tag-write hook in the
 * codebase is `useAddTagsToInstances`, which uses the *old* API and requires a
 * pre-existing computer. Standalone tag creation via `POST /api/v2/tags` is not
 * exposed by any hook and cannot be assumed to exist on the backend.
 *
 * CHOSEN MUTATION: PATCH /api/v2/preferences (org title)
 * ────────────────────────────────────────────────────────
 * `useOrgSettings` calls `authFetch.patch("preferences", params)` — a confirmed
 * v2 mutation (`useFetch`, not `useFetchOld`) that works on a fresh database
 * without pre-existing data. The mutated field (organisation `title`) is
 * immediately visible in the "Organization's name" `<input>` on
 * `/settings/general`, giving us a true UI-observable round-trip.
 *
 * AUTH STRATEGY
 * ─────────────
 * `GET /api/v2/me` is authenticated by the session cookie in storageState only
 * (the app uses a bare axios instance without the auth interceptor for this
 * endpoint). It returns `AuthUser.token`; every subsequent call includes
 * `Authorization: Bearer <token>`.
 */
import { expect, test, type APIRequestContext } from "@playwright/test";

// Re-use the session authenticated in global-setup.
test.use({ storageState: "e2e/docker-stack/.auth/state.json" });

// ─── helpers ────────────────────────────────────────────────────────────────

interface AuthUser {
  token: string;
  [key: string]: unknown;
}

interface Preferences {
  title: string;
  [key: string]: unknown;
}

/** Fetch the JWT for subsequent authenticated API calls. */
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

/** Fetch current org preferences. */
async function getPreferences(
  request: APIRequestContext,
  token: string,
): Promise<Preferences> {
  const res = await request.get("/api/v2/preferences", {
    headers: { Authorization: `Bearer ${token}` },
  });
  expect(res.ok(), `GET /api/v2/preferences failed: ${res.status()}`).toBe(
    true,
  );
  return (await res.json()) as Preferences;
}

/** Overwrite the org title. */
async function patchTitle(
  request: APIRequestContext,
  token: string,
  title: string,
): Promise<void> {
  const res = await request.patch("/api/v2/preferences", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    data: { title },
  });
  expect(
    res.ok(),
    `PATCH /api/v2/preferences failed: ${res.status()} ${await res.text()}`,
  ).toBe(true);
}

// ─── tests ───────────────────────────────────────────────────────────────────

test.describe("preferences mutation round-trip (real backend)", () => {
  let authToken = "";
  let originalTitle = "";

  test.beforeEach(async ({ request }) => {
    authToken = await getAuthToken(request);
    const prefs = await getPreferences(request, authToken);
    originalTitle = prefs.title;
  });

  test.afterEach(async ({ request }) => {
    // Restore the original org title so runs are idempotent.
    if (originalTitle && authToken) {
      await patchTitle(request, authToken, originalTitle);
    }
  });

  test("mutated org title is visible on /settings/general", async ({
    page,
    request,
  }) => {
    // Unique title per run so retries don't collide.
    const uniqueTitle = `Integration Test Org ${Date.now()}`;

    // ── 1. Mutate via the API ───────────────────────────────────────────────
    await patchTitle(request, authToken, uniqueTitle);

    // ── 2. Navigate to the settings page that reads the same endpoint ───────
    await page.goto("/settings/general");
    await expect(page.getByRole("main")).toBeVisible();
    await page.waitForLoadState("networkidle");

    // ── 3. Verify the mutated value is reflected in the UI ──────────────────
    // EditOrganisationPreferencesForm renders an <input label="Organization's name">
    // whose initial value is populated from GET /api/v2/preferences.
    await expect(page.getByLabel("Organization's name")).toHaveValue(
      uniqueTitle,
      { timeout: 15_000 },
    );
  });
});
