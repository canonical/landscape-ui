import { expect, test } from "@playwright/test";

test("should remove test distribution if present", async ({ page }) => {
  await page.goto("/");

  await expect(
    page
      .getByRole("button", {
        name: /add series to/i,
      })
      .first()
      .or(
        page.getByText(
          "To create a new mirror you must first create a distribution"
        )
      )
  ).toBeVisible();

  const removeDistributionButton = page.getByRole("button", {
    name: "Remove test-distro distribution",
  });

  if (!(await removeDistributionButton.isVisible())) {
    test.skip();
  }

  await removeDistributionButton.click();

  await page
    .getByRole("dialog", { name: "Removing test-distro distribution" })
    .getByRole("button", { name: "Remove test-distro distribution" })
    .click();

  await expect(
    page.getByRole("dialog", { name: "Removing test-distro distribution" })
  ).not.toBeVisible();

  await expect(
    page.getByRole("heading", { name: "test-distro" })
  ).not.toBeVisible();
});
