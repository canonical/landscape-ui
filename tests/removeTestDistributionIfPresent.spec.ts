import { expect, test } from "@playwright/test";

test("should remove test distribution if present", async ({ page }) => {
  await page.goto("/repositories/mirrors");

  await expect(
    page
      .getByRole("button", {
        name: /add series to/i,
      })
      .first()
      .or(
        page.getByText("To add a new mirror you must first add a distribution"),
      ),
  ).toBeVisible();

  const removeDistributionButton = page.getByRole("button", {
    name: "Remove test-e2e-distro distribution",
  });

  if (!(await removeDistributionButton.isVisible())) {
    test.skip();
  }

  await removeDistributionButton.click();

  await page
    .getByRole("dialog", { name: "Removing test-e2e-distro distribution" })
    .getByRole("button", { name: "Remove test-e2e-distro distribution" })
    .click();

  await expect(
    page.getByRole("dialog", { name: "Removing test-e2e-distro distribution" }),
  ).not.toBeVisible();

  await expect(
    page.getByRole("heading", { name: "test-e2e-distro" }),
  ).not.toBeVisible();
});
