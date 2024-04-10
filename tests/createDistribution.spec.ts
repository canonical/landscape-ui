import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/repositories/mirrors");
});

test("should create distribution", async ({ page }) => {
  await expect(
    page.getByRole("button", { name: "Create mirror", exact: true }),
  ).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Create distribution" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Create distribution" }).click();
  await page.getByRole("textbox").fill("test-e2e-distro");
  await page.getByLabel("Access group").selectOption("global");
  await page
    .getByRole("complementary")
    .getByRole("button", { name: "Create distribution" })
    .click();

  await expect(
    page.getByRole("heading", { name: "test-e2e-distro" }),
  ).toBeVisible();
  expect(
    await page
      .getByRole("heading", { name: "No series have been created yet" })
      .count(),
  ).toBeGreaterThanOrEqual(1);
  expect(
    await page
      .getByText("Create a new mirror or series to get started")
      .count(),
  ).toBeGreaterThanOrEqual(1);
  await expect(
    page.getByRole("button", { name: "Create mirror for test-e2e-distro" }),
  ).toBeVisible();
});
