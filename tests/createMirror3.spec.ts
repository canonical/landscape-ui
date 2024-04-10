import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/repositories/mirrors");
});

test("should create mirror using page header button", async ({ page }) => {
  await page
    .getByRole("button", { name: "Create mirror", exact: true })
    .click();

  await expect(
    page.getByRole("heading", { name: "Create new mirror" }),
  ).toBeVisible();

  await page
    .locator('select[name="distribution"]')
    .selectOption("test-e2e-distro");
  await page.locator('select[name="mirror_series"]').selectOption("focal");
  await page.locator('input[name="name"]').fill("test-mirror-focal");
  await page.locator('select[name="gpg_key"]').selectOption("sign-key");
  await page.getByText("Backports", { exact: true }).click();
  await page.getByText("Release", { exact: true }).click();
  await page.getByText("Security", { exact: true }).click();
  await page.getByText("Updates", { exact: true }).click();
  await page.getByText("Include .udeb packages (debian-installer)").click();
  await page
    .getByRole("complementary")
    .getByRole("button", { name: "Create mirror" })
    .click();

  await expect(
    page.getByRole("heading", { name: "test-mirror-focal" }),
  ).toBeVisible();

  await expect(
    page.getByRole("button", {
      name: "List backports pocket of test-e2e-distro/test-mirror-focal",
    }),
  ).toBeVisible();
});
