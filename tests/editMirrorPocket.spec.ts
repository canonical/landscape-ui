import { expect, test } from "@playwright/test";

test("should edit mirror pocket", async ({ page }) => {
  await page.goto("/repositories/mirrors");
  await page
    .getByRole("button", {
      name: "Edit test-mirror-pocket pocket of test-e2e-distro/test-derived-series",
    })
    .click();

  await expect(
    page.getByRole("heading", { name: "Edit test-mirror-pocket pocket" }),
  ).toBeVisible();

  const components = await page
    .getByRole("group", { name: "* Components" })
    .getByRole("checkbox")
    .all();

  for (const component of components) {
    await expect(component).toBeChecked();
  }

  await expect(
    page.locator("label").filter({ hasText: "amd64" }).getByRole("checkbox"),
  ).toBeChecked();
  await expect(
    page.locator("label").filter({ hasText: "i386" }).getByRole("checkbox"),
  ).not.toBeChecked();
  await expect(page.locator('select[name="mirror_gpg_key"]')).toHaveValue(
    "test-e2e-gpg-key",
  );
  await expect(
    page
      .locator("label")
      .filter({ hasText: "Include .udeb packages" })
      .getByRole("checkbox"),
  ).toBeChecked();

  await page.getByText("Universe").click();
  await page.getByText("Multiverse").click();
  await page.getByText("Restricted").click();
  await page.getByText("i386").click();
  await page.getByText("amd64").click();
  await page.locator('select[name="mirror_gpg_key"]').selectOption("-");
  await page.getByText("Include .udeb packages").click();
  await page.getByRole("button", { name: "Save changes" }).click();

  await page
    .getByRole("button", {
      name: "Edit test-mirror-pocket pocket of test-e2e-distro/test-derived-series",
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Edit test-mirror-pocket pocket" }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("group", { name: "* Components" })
      .locator("label")
      .filter({ hasText: "Main" }),
  ).toBeChecked();

  const shouldBeUncheckedLocators = await page
    .getByRole("group", { name: "* Components" })
    .locator("label")
    .filter({ hasNotText: "Main" })
    .all();

  for (const shouldBeUncheckedLocator of shouldBeUncheckedLocators) {
    await expect(shouldBeUncheckedLocator).not.toBeChecked();
  }

  await expect(
    page.locator("label").filter({ hasText: "amd64" }).getByRole("checkbox"),
  ).not.toBeChecked();
  await expect(
    page.locator("label").filter({ hasText: "i386" }).getByRole("checkbox"),
  ).toBeChecked();
  await expect(page.locator('select[name="mirror_gpg_key"]')).toHaveValue("-");
  await expect(
    page
      .locator("label")
      .filter({ hasText: "Include .udeb packages" })
      .getByRole("checkbox"),
  ).not.toBeChecked();
});
