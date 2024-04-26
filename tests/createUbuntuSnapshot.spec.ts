import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/repositories/mirrors");
});

test("should add ubuntu snapshot", async ({ page }) => {
  await page.getByRole("button", { name: "Add mirror", exact: true }).click();

  await expect(
    page.getByRole("heading", { name: "Add new mirror" }),
  ).toBeVisible();

  await page.locator('select[name="type"]').selectOption("ubuntu-snapshot");

  await expect(page.getByLabel("Mirror URI")).not.toBeVisible();
  await expect(page.getByText("Snapshot date")).toBeVisible();

  await page.locator('input[name="snapshotDate"]').fill("2023-07-20");
  await page
    .locator('select[name="distribution"]')
    .selectOption("test-e2e-distro");
  await page.locator('select[name="mirror_series"]').selectOption("noble");

  await expect(page.locator('input[name="name"]')).toHaveValue(
    "noble-snapshot-2023-07-20",
  );

  await page.locator('select[name="gpg_key"]').selectOption("sign-key");
  await page
    .getByRole("complementary")
    .getByRole("button", { name: "Add mirror" })
    .click();

  await expect(
    page.getByRole("heading", { name: "noble-snapshot-2023-07-20" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: "List release pocket of test-e2e-distro/noble-snapshot-2023-07-20",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: "List security pocket of test-e2e-distro/noble-snapshot-2023-07-20",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: "List updates pocket of test-e2e-distro/noble-snapshot-2023-07-20",
    }),
  ).toBeVisible();
});
