import { expect, test } from "@playwright/test";
import { STORAGE_STATE } from "../playwright.config";

test("should log in", async ({ page }) => {
  await page.goto("/");
  await page.locator('input[name="email"]').fill("john@example.com");
  await page.locator('input[name="password"]').fill("dashdemosite207");
  await page.getByText("Remember this device").click();
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/repositories\/mirrors/);
  await expect(
    page.getByRole("heading", { name: "Repository Mirrors" }),
  ).toBeVisible();

  await page.context().storageState({ path: STORAGE_STATE });
});
