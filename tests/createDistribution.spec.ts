import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/repositories/mirrors");
});

test("should add distribution", async ({ page }) => {
  await expect(
    page.getByRole("button", { name: "Add mirror", exact: true }),
  ).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Add distribution" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Add distribution" }).click();
  await page.getByRole("textbox").fill("test-e2e-distro");
  await page.getByLabel("Access group").selectOption("global");
  await page
    .getByRole("complementary")
    .getByRole("button", { name: "Add distribution" })
    .click();

  await expect(
    page.getByRole("heading", { name: "test-e2e-distro" }),
  ).toBeVisible();
  expect(
    await page
      .getByRole("heading", { name: "No series have been added yet" })
      .count(),
  ).toBeGreaterThanOrEqual(1);
  expect(
    await page.getByText("Add a new mirror or series to get started").count(),
  ).toBeGreaterThanOrEqual(1);
  await expect(
    page.getByRole("button", { name: "Add mirror for test-e2e-distro" }),
  ).toBeVisible();
});
