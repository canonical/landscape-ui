import { expect, test } from "@playwright/test";

test("should create repository profile", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Profiles" }).click();
  await expect(page).toHaveURL(/profiles/);

  await expect(
    page.getByRole("heading", { name: "Repository Profiles" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Create Profile" }).click();
  await expect(
    page.getByRole("heading", { name: "Create repository profile" })
  ).toBeVisible();

  await page.locator('input[name="title"]').fill("test-profile");
  await page
    .locator('input[name="description"]')
    .fill("Test profile description");
  await page.getByRole("combobox").selectOption("desktop");
  await expect(page.locator('input[name="tags"]')).toBeEnabled();
  await page.getByText("All computers").click();
  await expect(page.locator('input[name="tags"]')).toBeDisabled();

  await page.getByTestId("pockets-tab").click();

  await page
    .getByRole("listitem")
    .filter({ hasText: "test-distro" })
    .getByRole("listitem")
    .filter({ hasText: "test-mirror-jammy" })
    .getByText("release")
    .click();

  await page
    .getByRole("listitem")
    .filter({ hasText: "test-distro" })
    .getByRole("listitem")
    .filter({ hasText: "test-mirror-xenial" })
    .getByText("proposes")
    .click();

  const testSnapshotOptions = page
    .getByRole("listitem")
    .filter({ hasText: "test-distro" })
    .getByRole("listitem")
    .filter({ hasText: "test-snapshot" });

  await testSnapshotOptions.getByText("proposes").click();
  await testSnapshotOptions.getByText("test-mirror-pocket").click();

  await page.getByTestId("apt-sources-tab").click();

  const rows = page
    .getByRole("complementary")
    .getByRole("listitem")
    .filter({ hasNot: page.getByRole("tab") });

  await expect(rows).toHaveCount(2);
  await page.getByPlaceholder("Search").fill("apt");
  await expect(rows).toHaveCount(1);

  await page.getByText("test-apt-source").click();
  await page.getByRole("button", { name: "Reset search" }).click();
  await expect(rows).toHaveCount(2);
  await page
    .getByRole("button", { name: "Create profile", exact: true })
    .click();

  await expect(page.getByText("test-profile", { exact: true })).toBeVisible();

  const testProfileRow = page.getByRole("row").filter({
    has: page.getByText("test-profile", { exact: true }),
  });

  await expect(testProfileRow).toHaveCount(1);

  await testProfileRow.click();

  await expect(
    testProfileRow.getByRole("gridcell", { name: "Description" })
  ).toHaveText("Test profile description");

  await expect(
    testProfileRow.getByRole("gridcell", { name: "Access group" })
  ).toHaveText("Desktop machines");
});
