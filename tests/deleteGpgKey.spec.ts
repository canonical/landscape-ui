import { expect, test } from "@playwright/test";

test("should remove GPG key", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "GPG Keys" }).click();

  await page
    .getByRole("button", { name: "Remove test-e2e-gpg-key GPG key" })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Deleting test-e2e-gpg-key GPG key" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Are you sure? This action is permanent and can not be undone.",
    ),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Delete test-e2e-gpg-key GPG key" })
    .click();

  await expect(
    page.getByRole("row").filter({
      has: page.getByRole("rowheader", { name: "test-e2e-gpg-key" }),
    }),
  ).toHaveCount(0);
});
