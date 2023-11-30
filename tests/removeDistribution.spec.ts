import { expect, test } from "@playwright/test";

test("should remove test distribution", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "test-distro" }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Remove test-distro distribution" })
    .click();

  await expect(
    page.getByRole("dialog", { name: "Removing test-distro distribution" }),
  ).toBeVisible();
  await expect(
    page.getByText("Are you sure? This action cannot be undone."),
  ).toBeVisible();
  await page
    .getByRole("dialog", { name: "Removing test-distro distribution" })
    .getByRole("button", { name: "Remove test-distro distribution" })
    .click();

  await expect(
    page.getByRole("dialog", { name: "Removing test-distro distribution" }),
  ).not.toBeVisible();

  await expect(
    page.getByRole("heading", { name: "test-distro" }),
  ).not.toBeVisible();
});
