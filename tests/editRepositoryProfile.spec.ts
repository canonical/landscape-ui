import { expect, test } from "@playwright/test";

test("should edit repository profile", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Repositories" }).click();
  await page.getByRole("link", { name: "Profiles" }).click();

  await page
    .getByRole("button", { name: "Edit test-profile repository profile" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Edit test-profile" }),
  ).toBeVisible();
  await expect(page.getByText("All computers")).toBeChecked();
  await expect(page.locator('input[name="tags"]')).toBeDisabled();
  await page.getByText("All computers").click();
  await expect(page.locator('input[name="tags"]')).toBeEnabled();
  await page.locator('input[name="tags"]').fill("test-tag");

  await page.getByTestId("pockets-tab").click();

  await expect(
    page
      .getByRole("listitem")
      .filter({ hasText: "test-distro" })
      .getByRole("listitem")
      .filter({ hasText: "test-mirror-jammy" })
      .getByText("release"),
  ).toBeChecked();

  await expect(
    page
      .getByRole("listitem")
      .filter({ hasText: "test-distro" })
      .getByRole("listitem")
      .filter({ hasText: "test-mirror-xenial" })
      .getByText("proposes"),
  ).toBeChecked();

  const testSnapshotOptions = page
    .getByRole("listitem")
    .filter({ hasText: "test-distro" })
    .getByRole("listitem")
    .filter({ hasText: "test-derived-series" });

  await expect(testSnapshotOptions.getByText("proposes")).toBeChecked();
  await expect(
    testSnapshotOptions.getByText("test-mirror-pocket"),
  ).toBeChecked();
  await expect(
    testSnapshotOptions.getByText("test-pull-pocket"),
  ).not.toBeChecked();
  await expect(
    testSnapshotOptions.getByText("test-upload-pocket"),
  ).not.toBeChecked();

  await testSnapshotOptions.getByText("proposes").click();
  await testSnapshotOptions.getByText("test-mirror-pocket").click();
  await testSnapshotOptions.getByText("test-pull-pocket").click();
  await testSnapshotOptions.getByText("test-upload-pocket").click();

  await page.getByTestId("apt-sources-tab").click();

  await expect(page.getByText("test-apt-source")).toBeChecked();
  await page.getByText("test-apt-source").click();

  await page.getByRole("button", { name: "Save changes" }).click();

  await expect(page.getByRole("complementary")).not.toBeVisible();
});
