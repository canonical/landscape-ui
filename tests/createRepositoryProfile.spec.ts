import { expect, test } from "@playwright/test";

test("should create repository profile", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "Profiles" }).click();
  await expect(page).toHaveURL(/profiles/);

  await expect(
    page.getByRole("heading", { name: "Repository Profiles" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Create Profile" }).click();
  await expect(
    page.getByRole("heading", { name: "Create repository profile" }),
  ).toBeVisible();

  await page.locator('input[name="title"]').fill("test-e2e-profile");
  await page
    .locator('input[name="description"]')
    .fill("Test profile description");
  await page
    .getByRole("complementary")
    .getByText("Access group", { exact: true })
    .selectOption("global");
  await expect(page.locator('input[name="tags"]')).toBeEnabled();
  await page.getByText("All instances").click();
  await expect(page.locator('input[name="tags"]')).toBeDisabled();

  await page.getByTestId("pockets-tab").click();

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
    .getByText("proposes")
    .click();

  const testDerivedSeriesOptions = page
    .getByRole("listitem")
    .filter({ hasText: "test-e2e-distro" })
    .getByRole("listitem")
    .filter({ hasText: "test-derived-series" });

  await testDerivedSeriesOptions.getByText("proposes").click();
  await testDerivedSeriesOptions.getByText("test-mirror-pocket").click();

  await page.getByTestId("apt-sources-tab").click();

  const rows = page
    .getByRole("complementary")
    .getByRole("listitem")
    .filter({ hasNot: page.getByRole("tab") });

  expect(await rows.count()).toBeGreaterThanOrEqual(1);
  await page.getByPlaceholder("Search").fill("e2e");
  expect(await rows.count()).toEqual(1);

  await page.getByText("test-e2e-apt-source").click();
  await page.getByRole("button", { name: "Reset search" }).click();
  expect(await rows.count()).toBeGreaterThanOrEqual(1);
  await page.getByLabel("Create profile").click();

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
