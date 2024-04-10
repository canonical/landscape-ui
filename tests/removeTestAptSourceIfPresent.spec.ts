import { expect, test } from "@playwright/test";

test("should remove test APT source if present", async ({ page }) => {
  await page.goto("/repositories/mirrors");
  await page.getByRole("link", { name: "APT Sources" }).click();

  await expect(
    page
      .getByRole("button", {
        name: /Remove/i,
      })
      .first()
      .or(page.getByText("You haven’t added any APT sources yet.")),
  ).toBeVisible();

  const removeAptSourceButton = page.getByRole("button", {
    name: "Remove test-e2e-apt-source APT source",
  });

  if (!(await removeAptSourceButton.isVisible())) {
    test.skip();
  }

  await removeAptSourceButton.click();

  await page
    .getByRole("dialog", { name: "Deleting test-e2e-apt-source APT source" })
    .getByRole("button", { name: "Delete test-e2e-apt-source APT source" })
    .click();

  await expect(
    page.getByRole("dialog", {
      name: "Deleting test-e2e-apt-source APT source",
    }),
  ).not.toBeVisible();

  await expect(removeAptSourceButton).not.toBeVisible();
});
