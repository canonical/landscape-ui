import { expect, test } from "@playwright/test";

test("should add pockets with the different mode", async ({ page }) => {
  await page.goto("/repositories/mirrors");

  await page
    .getByRole("button", {
      name: "Add new pocket for test-e2e-distro/test-derived-series",
    })
    .click();
  await expect(page.locator('select[name="mode"]')).toHaveValue("mirror");
  await page.locator('input[name="name"]').fill("test-mirror-pocket");
  await page.locator('select[name="gpg_key"]').selectOption("sign-key");
  await page
    .locator("label")
    .filter({ hasText: "Mirror suite" })
    .locator("div")
    .filter({ has: page.locator("> i") })
    .hover();
  await expect(
    page.getByRole("tooltip", { name: "The specific sub-directory" }),
  ).toBeVisible();
  await page.locator('input[name="mirror_suite"]').fill("trusty-security");
  await page
    .locator('select[name="mirror_gpg_key"]')
    .selectOption("test-e2e-gpg-key");
  await page.getByText("Include .udeb packages").click();
  await page.getByRole("button", { name: "Add pocket" }).click();

  await expect(
    page.getByRole("button", {
      name: "List test-mirror-pocket pocket of test-e2e-distro/test-derived-series",
    }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("row")
      .filter({
        has: page.getByRole("button", {
          name: "List test-mirror-pocket pocket of test-e2e-distro/test-derived-series",
        }),
      })
      .getByLabel("Mode"),
  ).toHaveText("mirror");

  await page
    .getByRole("button", {
      name: "Add new pocket for test-e2e-distro/test-derived-series",
    })
    .click();
  await page.locator('select[name="mode"]').selectOption("pull");
  await page
    .getByRole("combobox", { name: "* Pull from" })
    .selectOption("test-derived-series/test-mirror-pocket");
  await page.getByRole("textbox").fill("test-pull-pocket");
  await page.locator('select[name="gpg_key"]').selectOption("sign-key");
  await page.locator('select[name="filter_type"]').selectOption("whitelist");
  await page.getByRole("button", { name: "Add pocket" }).click();

  await expect(
    page.getByRole("button", {
      name: "List test-pull-pocket pocket of test-e2e-distro/test-derived-series",
    }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("row")
      .filter({
        has: page.getByRole("button", {
          name: "List test-pull-pocket pocket of test-e2e-distro/test-derived-series",
        }),
      })
      .getByLabel("Mode"),
  ).toHaveText("pull");

  await page
    .getByRole("button", {
      name: "Add new pocket for test-e2e-distro/test-derived-series",
    })
    .click();
  await page.locator('select[name="mode"]').selectOption("upload");
  await page.getByRole("textbox").fill("test-upload-pocket");
  await page.locator('select[name="gpg_key"]').selectOption("sign-key");
  await page.getByText("Allow uploaded packages to be unsigned").click();
  await page.getByRole("button", { name: "Add pocket" }).click();

  await expect(
    page.getByRole("button", {
      name: "List test-upload-pocket pocket of test-e2e-distro/test-derived-series",
    }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("row")
      .filter({
        has: page.getByRole("button", {
          name: "List test-upload-pocket pocket of test-e2e-distro/test-derived-series",
        }),
      })
      .getByLabel("Mode"),
  ).toHaveText("upload");
});
