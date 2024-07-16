import { expect, test } from "@playwright/test";

test("should handle repository profile", async ({ page }) => {
  await page.goto("/profiles/repositories");

  await page
    .getByRole("button", { name: "Edit test-e2e-profile repository profile" })
    .click();

  await expect(page.getByText("All instances")).not.toBeChecked();
  await expect(page.getByRole("combobox", { name: "tags" })).toBeVisible();
  await expect(page.getByLabel("test-tag")).toBeChecked();

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

  const testSnapshotOptions = page
    .getByRole("listitem")
    .filter({ hasText: "test-e2e-distro" })
    .getByRole("listitem")
    .filter({ hasText: "test-derived-series" });

  await expect(testSnapshotOptions.getByText("proposed")).not.toBeChecked();
  await expect(
    testSnapshotOptions.getByText("test-mirror-pocket"),
  ).not.toBeChecked();
  await expect(testSnapshotOptions.getByText("test-pull-pocket")).toBeChecked();
  await expect(
    testSnapshotOptions.getByText("test-upload-pocket"),
  ).toBeChecked();

  await page.getByRole("tab", { name: "APT Sources" }).click();

  await expect(page.getByText("test-e2e-apt-source")).not.toBeChecked();

  await page.getByRole("button", { name: "Close side panel" }).click();
  await page
    .getByRole("button", { name: "Remove test-e2e-profile repository profile" })
    .click();
  await expect(
    page.getByRole("dialog", {
      name: "Deleting test-e2e-profile repository profile",
    }),
  ).toBeVisible();
  await expect(page.getByText("Are you sure?")).toBeVisible();
  await page
    .getByRole("button", { name: "Delete test-e2e-profile repository profile" })
    .click();

  await expect(
    page.getByText("test-e2e-profile", { exact: true }),
  ).not.toBeVisible();
});
