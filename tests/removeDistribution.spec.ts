import { expect, test } from "@playwright/test";

test("should remove test distribution", async ({ page }) => {
  await page.goto("/repositories/mirrors");
  await expect(
    page.getByRole("heading", { name: "test-e2e-distro" }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Remove test-e2e-distro distribution" })
    .click();

  await expect(
    page.getByRole("dialog", { name: "Removing test-e2e-distro distribution" }),
  ).toBeVisible();
  await expect(
    page.getByText("Are you sure? This action cannot be undone."),
  ).toBeVisible();
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
