import { expect, test } from "@playwright/test";

test("should remove test mirror", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Remove test-distro/test-mirror-focal" })
    .click();
  await page
    .getByRole("button", { name: "Remove test-mirror-focal from test-distro" })
    .click();
  await expect(
    page.getByRole("heading", { name: "test-mirror-focal" }),
  ).not.toBeVisible();
});
