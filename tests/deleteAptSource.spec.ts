import { expect, test } from "@playwright/test";

test("should delete APT source", async ({ page }) => {
  await page.goto("/repositories/mirrors");

  await page.getByRole("link", { name: "APT Sources" }).click();

  await page
    .getByRole("button", { name: "Remove test-e2e-apt-source APT source" })
    .click();
  await expect(
    page.getByRole("dialog", {
      name: "Deleting test-e2e-apt-source APT source",
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Are you sure? This action is permanent and cannot be undone.",
    ),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Delete test-e2e-apt-source APT source" })
    .click();

  await expect(
    page.getByRole("row").filter({
      has: page.getByRole("cell", { name: "test-e2e-apt-source" }),
    }),
  ).toHaveCount(0);
});
