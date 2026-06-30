import { test, expect } from "@playwright/test";

// Re-use the session authenticated in global-setup — no login step needed.
test.use({ storageState: "e2e/docker-stack/.auth/state.json" });

test.describe("instances list (real backend)", () => {
  test("renders instances page from the real API", async ({ page }) => {
    await page.goto("/instances");

    await expect(page.getByRole("main")).toBeVisible();

    // Wait for the API response — either a table (with computers) or an empty
    // state renders. networkidle confirms the fetch has settled.
    await page.waitForLoadState("networkidle");

    // The page must not be stuck on a loading spinner or error screen.
    // A heading confirms the route resolved correctly.
    await expect(
      page.getByRole("heading", { name: "Instances", exact: true }),
    ).toBeVisible({ timeout: 15_000 });
  });
});
