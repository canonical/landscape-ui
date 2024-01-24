import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("should create mirror using distribution empty state button", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Create mirror for test-e2e-distro" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Create mirror for test-e2e-distro" }),
  ).toBeVisible();
  await page.locator('select[name="mirror_series"]').selectOption("jammy");
  await page.locator('input[name="name"]').fill("test-mirror-jammy");
  await page.locator('select[name="gpg_key"]').selectOption("sign-key");
  await page
    .getByRole("complementary")
    .getByRole("button", { name: "Create mirror" })
    .click();

  await expect(
    await page.getByRole("heading", { name: "test-mirror-jammy" }),
  ).toBeVisible();

  await expect(
    await page.getByRole("button", {
      name: "List release pocket of test-e2e-distro/test-mirror-jammy",
    }),
  ).toBeVisible();
  await expect(
    await page.getByRole("button", {
      name: "List security pocket of test-e2e-distro/test-mirror-jammy",
    }),
  ).toBeVisible();
  await expect(
    await page.getByRole("button", {
      name: "List updates pocket of test-e2e-distro/test-mirror-jammy",
    }),
  ).toBeVisible();
});
