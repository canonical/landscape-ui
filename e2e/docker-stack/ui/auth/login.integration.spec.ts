import { test, expect } from "@playwright/test";

// This test intentionally re-exercises the login flow with a fresh context.
// It does NOT use storageState. See e2e/docker-stack/global-setup.ts which
// performs the same login once to produce storageState for other tests.
test.use({ storageState: { cookies: [], origins: [] } });

const email = (): string => process.env.CI_ADMIN_EMAIL ?? "john@example.com";

const password = (): string => process.env.CI_ADMIN_PASSWORD ?? "pwd";

test.describe("login (real backend)", () => {
  test("signs in with seeded admin credentials and lands on overview", async ({
    page,
  }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();

    await page.locator('input[name="identifier"]').fill(email());
    await page.locator('input[name="password"]').fill(password());
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/overview/, { timeout: 30_000 });
    // Confirm authenticated content rendered — not just a redirect to a broken page.
    await expect(page.getByRole("main")).toBeVisible();
  });
});
