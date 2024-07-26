import { expect, test } from "@playwright/test";

test("should add series to test distribution", async ({ page }) => {
  await page.goto("/repositories/mirrors");

  await page
    .getByRole("button", { name: "Add series to test-e2e-distro" })
    .click();

  await expect(
    page.getByRole("heading", { name: "Add series to test-e2e-distro" }),
  ).toBeVisible();

  await page.locator('select[name="mirror_series"]').selectOption("xenial");
  await page.locator('input[name="name"]').fill("test-mirror-xenial");
  await page.locator('select[name="gpg_key"]').selectOption("sign-key");
  await page.getByText("Release", { exact: true }).click();
  await page.getByText("Security", { exact: true }).click();
  await page.getByText("Updates", { exact: true }).click();
  await page.getByText("Proposed", { exact: true }).click();
  await page.getByText("Universe").click();
  await page.getByText("Main").click();
  await page.getByText("Restricted").click();
  await page.getByText("i386").click();
  await page.getByText("amd64").click();
  await page
    .getByRole("complementary")
    .getByRole("button", { name: "Add series" })
    .click();

  await expect(
    page.getByRole("heading", { name: "test-mirror-xenial" }),
  ).toBeVisible();

  await expect(
    page.getByRole("button", {
      name: "List proposed pocket of test-e2e-distro/test-mirror-xenial",
    }),
  ).toBeVisible();
});
