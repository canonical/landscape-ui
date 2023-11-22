import { expect, test } from "@playwright/test";

test("should create pockets with the different mode", async ({ page }) => {
  await page.goto("/");

  await page
    .getByRole("button", {
      name: "Create new pocket for test-distro/test-derived-series",
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
    page.getByRole("tooltip", {
      name: "The specific sub-directory under dists/ that should be mirrored. If the suite name ends with a ‘/’, the remote repository is flat (no dists/ structure, see wiki.debian.org/RepositoryFormat#Flat_Repository_Format); in this case a single value must be passed for the ‘components’ parameter. Packages from the remote repository will be mirrored in the specified component. This parameter is optional and defaults to the same name as local series and pocket.",
    }),
  ).toBeVisible();
  await page.locator('input[name="mirror_suite"]').fill("trusty-security");
  await page
    .locator('select[name="mirror_gpg_key"]')
    .selectOption("esm-apps-key");
  await page.getByText("Include .udeb packages (debian-installer)").click();
  await page.getByRole("button", { name: "Create pocket" }).click();

  await expect(
    page.getByRole("button", {
      name: "List test-mirror-pocket pocket of test-distro/test-derived-series",
    }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("row")
      .filter({
        has: page.getByRole("button", {
          name: "List test-mirror-pocket pocket of test-distro/test-derived-series",
        }),
      })
      .getByRole("gridcell", { name: "Mode" }),
  ).toHaveText("mirror");

  await page
    .getByRole("button", {
      name: "Create new pocket for test-distro/test-derived-series",
    })
    .click();
  await page.locator('select[name="mode"]').selectOption("pull");
  await page
    .getByRole("combobox", { name: "* Pull from" })
    .selectOption("test-derived-series/test-mirror-pocket");
  await page.getByRole("textbox").fill("test-pull-pocket");
  await page.locator('select[name="gpg_key"]').selectOption("sign-key");
  await page.locator('select[name="filter_type"]').selectOption("whitelist");
  await page.getByRole("button", { name: "Create pocket" }).click();

  await expect(
    page.getByRole("button", {
      name: "List test-pull-pocket pocket of test-distro/test-derived-series",
    }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("row")
      .filter({
        has: page.getByRole("button", {
          name: "List test-pull-pocket pocket of test-distro/test-derived-series",
        }),
      })
      .getByRole("gridcell", { name: "Mode" }),
  ).toHaveText("pull");

  await page
    .getByRole("button", {
      name: "Create new pocket for test-distro/test-derived-series",
    })
    .click();
  await page.locator('select[name="mode"]').selectOption("upload");
  await page.getByRole("textbox").fill("test-upload-pocket");
  await page.locator('select[name="gpg_key"]').selectOption("sign-key");
  await page.getByText("Allow uploaded packages to be unsigned").click();
  await expect(page.getByRole("listbox")).toBeDisabled();
  await page.getByRole("button", { name: "Create pocket" }).click();

  await expect(
    page.getByRole("button", {
      name: "List test-upload-pocket pocket of test-distro/test-derived-series",
    }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("row")
      .filter({
        has: page.getByRole("button", {
          name: "List test-upload-pocket pocket of test-distro/test-derived-series",
        }),
      })
      .getByRole("gridcell", { name: "Mode" }),
  ).toHaveText("upload");
});
