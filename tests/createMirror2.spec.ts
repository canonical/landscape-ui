import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("should add series to test distribution", async ({ page }) => {
  await page.getByRole("button", { name: "Add series to test-distro" }).click();

  await expect(
    page.getByRole("heading", { name: "Add series to test-distro" })
  ).toBeVisible();

  await page.locator('select[name="mirror_series"]').selectOption("xenial");
  await page.locator('input[name="name"]').fill("test-mirror-xenial");
  await page.locator('select[name="gpg_key"]').selectOption("sign-key");
  await page.getByText("Release", { exact: true }).click();
  await page.getByText("Security", { exact: true }).click();
  await page.getByText("Updates", { exact: true }).click();
  await page.getByText("Proposed").click();
  await page.getByText("Universe").click();
  await page.getByText("Main").click();
  await page.getByText("Restricted").click();
  await page.getByText("i386").click();
  await page.getByText("amd64").click();
  await page
    .getByRole("complementary")
    .getByRole("button", { name: "Create mirror" })
    .click();

  await expect(
    page.getByRole("heading", { name: "test-mirror-xenial" })
  ).toBeVisible();

  await expect(
    await page.getByRole("button", {
      name: "List proposes pocket of test-distro/test-mirror-xenial",
    })
  ).toBeVisible();
});
