import { expect, test } from "@playwright/test";

test("should delete APT source", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Repositories" }).click();
  await page.getByRole("link", { name: "APT Sources" }).click();

  await page
    .getByRole("button", { name: "Remove test-apt-source APT source" })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Deleting test-apt-source APT source" })
  ).toBeVisible();
  await expect(
    page.getByText(
      "Are you sure? This action is permanent and can not be undone."
    )
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Delete test-apt-source APT source" })
    .click();

  await expect(
    page
      .getByRole("row")
      .filter({ has: page.getByRole("gridcell", { name: "test-apt-source" }) })
  ).toHaveCount(0);
});
