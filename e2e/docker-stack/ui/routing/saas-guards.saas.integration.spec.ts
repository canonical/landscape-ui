/**
 * SaaS mode integration tests
 *
 * WHAT THIS TESTS
 * ───────────────
 * Verifies that the dashboard works correctly when running in SaaS mode
 * (VITE_SELF_HOSTED_ENV=false). Two concerns are tested together:
 *
 *   1. API calls still work in SaaS mode. The Vite proxy, auth session, and
 *      core backend endpoints must all function with the SaaS env flag set.
 *      This is confirmed by navigating to a page that fetches real data and
 *      verifying the result renders.
 *
 *   2. Self-hosted-only routes redirect to /env-error. All /repositories/*
 *      routes are wrapped in <SelfHostedGuard>. When isSelfHosted is false
 *      the guard calls navigate('/env-error', { replace: true }) before
 *      rendering any page content.
 *
 * By establishing (1) before asserting (2) we confirm the redirect is caused
 * by the frontend guard — not a broken session, proxy failure, or 401.
 *
 * NOTE: If the Landscape API introduces server-side SaaS feature gating in
 * future, these tests may need to be split — the API-call step might require
 * a dedicated SaaS backend endpoint. For now the same landscape-server
 * instance serves both modes; only the frontend env flag differs.
 *
 * AUTH
 * ────
 * storageState from global-setup is reused. The SaaS Vite server points at
 * the same backend (proxy targets are identical in .env.e2e.saas).
 */
import { expect, test } from "@playwright/test";

test.use({ storageState: "e2e/docker-stack/.auth/state.json" });

const SELF_HOSTED_ONLY_ROUTES = [
  "/repositories/publication-targets",
  "/repositories/publications",
  "/repositories/mirrors",
  "/repositories/local-repositories",
];

test.describe("SaaS mode", () => {
  test("real API calls work with VITE_SELF_HOSTED_ENV=false", async ({
    page,
  }) => {
    await page.goto("/instances");
    await page.waitForLoadState("networkidle");
    await expect(
      page.getByRole("heading", { name: "Instances", exact: true }),
    ).toBeVisible({ timeout: 15_000 });
  });

  test.describe("self-hosted-only route guards", () => {
    for (const route of SELF_HOSTED_ONLY_ROUTES) {
      test(`${route} redirects to /env-error`, async ({ page }) => {
        // First confirm the session and API are healthy in SaaS mode.
        await page.goto("/instances");
        await page.waitForLoadState("networkidle");
        await expect(
          page.getByRole("heading", { name: "Instances", exact: true }),
        ).toBeVisible({ timeout: 15_000 });

        // Now navigate to the self-hosted-only route and assert the guard fires.
        await page.goto(route);
        await page.waitForURL("**/env-error", { timeout: 10_000 });
        await expect(page).toHaveURL(/\/env-error/);
      });
    }
  });
});
