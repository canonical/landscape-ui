import { expect, test } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Remove test-distro distribution" })
    .click();
  await page
    .getByRole("dialog", { name: "Remove distribution" })
    .getByRole("button", { name: "Remove" })
    .click();
  await expect(
    page.getByRole("heading", { name: "test-distro" })
  ).not.toBeVisible();
});
