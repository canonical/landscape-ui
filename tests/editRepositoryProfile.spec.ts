import { expect, test } from "@playwright/test";

test("should edit repository profile", async ({ page }) => {
  await page.goto("/profiles/repositories");

  await page
    .getByRole("button", { name: "Edit test-e2e-profile repository profile" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Edit test-e2e-profile" }),
  ).toBeVisible();
  await expect(page.getByText("All instances")).toBeChecked();
  await expect(page.getByRole("combobox", { name: "tags" })).not.toBeVisible();
  await page.getByText("All instances").click();
  await expect(page.getByRole("combobox", { name: "tags" })).toBeVisible();
  await page.getByRole("combobox", { name: "tags" }).click();
  await page.getByText("test-tag").click();

  await page.getByRole("tab", { name: "Pockets" }).click();

  await expect(
    page
      .getByRole("listitem")
      .filter({ hasText: "test-e2e-distro" })
      .getByRole("listitem")
      .filter({ hasText: "test-mirror-jammy" })
      .getByText("release"),
  ).toBeChecked();

  await expect(
    page
      .getByRole("listitem")
      .filter({ hasText: "test-e2e-distro" })
      .getByRole("listitem")
      .filter({ hasText: "test-mirror-xenial" })
      .getByText("proposed"),
  ).toBeChecked();

  const testDerivedSeriesOptions = page
    .getByRole("listitem")
    .filter({ hasText: "test-e2e-distro" })
    .getByRole("listitem")
    .filter({ hasText: "test-derived-series" });

  await expect(testDerivedSeriesOptions.getByText("proposed")).toBeChecked();
  await expect(
    testDerivedSeriesOptions.getByText("test-mirror-pocket"),
  ).toBeChecked();
  await expect(
    testDerivedSeriesOptions.getByText("test-pull-pocket"),
  ).not.toBeChecked();
  await expect(
    testDerivedSeriesOptions.getByText("test-upload-pocket"),
  ).not.toBeChecked();

  await testDerivedSeriesOptions.getByText("proposed").click();
  await testDerivedSeriesOptions.getByText("test-mirror-pocket").click();
  await testDerivedSeriesOptions.getByText("test-pull-pocket").click();
  await testDerivedSeriesOptions.getByText("test-upload-pocket").click();

  await page.getByRole("tab", { name: "APT Sources" }).click();

  await expect(page.getByText("test-e2e-apt-source")).toBeChecked();
  await page.getByText("test-e2e-apt-source").click();

  await page.getByText("Save changes").click();

  await expect(page.getByRole("complementary")).not.toBeVisible();
});
