import { expect, test } from "@playwright/test";
import { e2eCheckPageHeading, e2eCheckSitePanelTitle } from "./helpers";

test("should add repository profile", async ({ page }) => {
  await page.goto("/profiles/repositories");

  await page
    .getByRole("complementary")
    .getByRole("link", { name: "Profiles" })
    .click();

  await expect(page).toHaveURL(/profiles/);

  await e2eCheckPageHeading(page, "Repository Profiles");

  await page.getByRole("button", { name: "Add profile" }).click();

  await e2eCheckSitePanelTitle(page, "Add repository profile");

  await page.locator('input[name="title"]').fill("test-e2e-profile");

  await page
    .locator('input[name="description"]')
    .fill("Test profile description");

  await page
    .getByRole("complementary")
    .getByText("Access group", { exact: true })
    .selectOption("global");
  await expect(page.getByRole("combobox", { name: "tags" })).toBeVisible();
  await page.getByText("All instances").click();
  await expect(page.getByRole("combobox", { name: "tags" })).not.toBeVisible();

  await page.getByRole("tab", { name: "Pockets" }).click();

  await page
    .getByRole("listitem")
    .filter({ hasText: "test-e2e-distro" })
    .getByRole("listitem")
    .filter({ hasText: "test-mirror-jammy" })
    .getByText("release")
    .click();

  await page
    .getByRole("listitem")
    .filter({ hasText: "test-e2e-distro" })
    .getByRole("listitem")
    .filter({ hasText: "test-mirror-xenial" })
    .getByText("proposed")
    .click();

  const testDerivedSeriesOptions = page
    .getByRole("listitem")
    .filter({ hasText: "test-e2e-distro" })
    .getByRole("listitem")
    .filter({ hasText: "test-derived-series" });

  await testDerivedSeriesOptions.getByText("proposed").click();
  await testDerivedSeriesOptions.getByText("test-mirror-pocket").click();

  await page.getByRole("tab", { name: "APT Sources" }).click();

  const rows = page
    .getByRole("listitem")
    .filter({ hasNot: page.getByRole("tab") });

  expect(await rows.count()).toBeGreaterThanOrEqual(1);
  await page.getByPlaceholder("Search").fill("e2e");
  await page.getByPlaceholder("Search").press("Enter");
  expect(await rows.count()).toEqual(1);

  await page.getByText("test-e2e-apt-source").click();
  await page.getByRole("button", { name: "Reset search" }).click();
  expect(await rows.count()).toBeGreaterThanOrEqual(1);
  await page
    .getByRole("button", { name: "Add a new repository profile" })
    .click();

  await expect(
    page.getByText("test-e2e-profile", { exact: true }),
  ).toBeVisible();

  const testProfileRow = page.getByRole("row").filter({
    has: page.getByRole("rowheader", { name: "test-e2e-profile", exact: true }),
  });

  await expect(testProfileRow).toHaveCount(1);

  await expect(testProfileRow.getByLabel("Description")).toHaveText(
    "Test profile description",
  );

  await expect(testProfileRow.getByLabel("Access group")).toHaveText(
    "Global access",
  );
});
