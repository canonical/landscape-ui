import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("should create distribution", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Create mirror" })).toHaveCount(
    1
  );
  await expect(
    page.getByRole("button", { name: "Create distribution" })
  ).toBeVisible();

  await page.getByRole("button", { name: "Create distribution" }).click();
  await page.getByRole("textbox").fill("test-distro");
  await page.getByRole("combobox").selectOption("global");
  await page
    .getByRole("complementary")
    .getByRole("button", { name: "Create distribution" })
    .click();

  await expect(
    page.getByRole("heading", { name: "test-distro" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "No series have been created yet" })
  ).toBeVisible();
  await expect(
    page.getByText("Create a new mirror or series to get started")
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Create mirror for test-distro" })
  ).toBeVisible();
});
