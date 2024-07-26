import { expect, test } from "@playwright/test";

test("should remove test mirror", async ({ page }) => {
  await page.goto("/repositories/mirrors");

  await page
    .getByRole("button", { name: "Remove test-e2e-distro/test-derived-series" })
    .click();
  await page
    .getByRole("button", {
      name: "Remove test-derived-series from test-e2e-distro",
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "test-derived-series" }),
  ).not.toBeVisible();
});
