import { expect, test } from "@playwright/test";

test("should remove test GPG key if present", async ({ page }) => {
  await page.goto("/repositories/mirrors");

  await page.getByRole("link", { name: "GPG Keys" }).click();

  await expect(
    page
      .getByRole("button", {
        name: /Remove/i,
      })
      .first()
      .or(page.getByText("You haven’t added any GPG keys yet.")),
  ).toBeVisible();

  const removeGpgKeyButton = page.getByRole("button", {
    name: "Remove test-gpg-key GPG key",
  });

  if (!(await removeGpgKeyButton.isVisible())) {
    test.skip();
  }

  await removeGpgKeyButton.click();

  await page
    .getByRole("dialog", { name: "Deleting test-gpg-key GPG key" })
    .getByRole("button", { name: "Delete test-gpg-key GPG key" })
    .click();

  await expect(
    page.getByRole("dialog", { name: "Deleting test-gpg-key GPG key" }),
  ).not.toBeVisible();

  await expect(removeGpgKeyButton).not.toBeVisible();
});
