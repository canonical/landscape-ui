import { expect, test } from "@playwright/test";

test("should remove test repository profile if present", async ({ page }) => {
  await page.goto("/repositories/mirrors");
  await page.getByRole("button", { name: "Profiles" }).click();
  await page.getByRole("link", { name: "Repository Profiles" }).click();

  await expect(
    page
      .getByRole("button", {
        name: /Remove/i,
      })
      .first()
      .or(page.getByText("You haven’t added any profile yet.")),
  ).toBeVisible();

  const removeRepositoryProfileButton = page.getByRole("button", {
    name: "Remove test-e2e-profile repository profile",
  });

  if (!(await removeRepositoryProfileButton.isVisible())) {
    test.skip();
  }

  await removeRepositoryProfileButton.click();

  await page
    .getByRole("dialog", {
      name: "Deleting test-e2e-profile repository profile",
    })
    .getByRole("button", { name: "Delete test-e2e-profile repository profile" })
    .click();

  await expect(
    page.getByRole("dialog", {
      name: "Deleting test-e2e-profile repository profile",
    }),
  ).not.toBeVisible();

  await expect(removeRepositoryProfileButton).not.toBeVisible();
});
