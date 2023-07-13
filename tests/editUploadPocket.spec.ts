import { expect, test } from "@playwright/test";

test("should edit upload pocket", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", {
      name: "List test-upload-pocket pocket of test-distro/test-snapshot",
    })
    .click();
  await page
    .getByRole("complementary")
    .getByRole("button", {
      name: "Edit test-upload-pocket pocket of test-distro/test-snapshot",
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Edit test-upload-pocket pocket" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  await page
    .getByRole("button", {
      name: "Edit test-upload-pocket pocket of test-distro/test-snapshot",
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Edit test-upload-pocket pocket" })
  ).toBeVisible();
  await expect(
    page
      .locator("label")
      .filter({ hasText: "Allow uploaded packages to be unsigned" })
      .getByRole("checkbox")
  ).toBeChecked();
  await expect(page.getByRole("listbox")).toBeDisabled();
  await page.getByText("Allow uploaded packages to be unsigned").click();
  await expect(page.getByRole("listbox")).toBeEnabled();
  await page.getByRole("listbox").selectOption(["esm-apps-key"]);
  await page.getByRole("button", { name: "Save changes" }).click();

  await page
    .getByRole("button", {
      name: "Edit test-upload-pocket pocket of test-distro/test-snapshot",
    })
    .click();

  await expect(
    page
      .locator("label")
      .filter({ hasText: "Allow uploaded packages to be unsigned" })
      .getByRole("checkbox")
  ).not.toBeChecked();
  await expect(page.getByRole("listbox")).toHaveValues(["esm-apps-key"]);
});
