import { expect, test } from "@playwright/test";

test("should create test mirror snapshot", async ({ page }) => {
  await page.goto("/");
  await page
    .locator("div")
    .filter({ hasText: /^test-mirror-xenialDerive seriesNew pocketRemove$/ })
    .getByRole("button", { name: "Derive series" })
    .click();
  await page.getByRole("textbox").fill("test-snapshot");
  await page.getByRole("button", { name: "Create and sync" }).click();
  await expect(
    page.getByRole("heading", { name: "test-snapshot" }),
  ).toBeVisible();
  await expect(
    page.getByText("pulling from test-mirror-xenial/proposes"),
  ).toBeVisible();
  await expect(
    page
      .getByRole("rowgroup")
      .filter({
        has: page.getByRole("button", {
          name: "List proposes pocket of test-distro/test-snapshot",
        }),
      })
      .getByRole("gridcell", { name: "Mode" }),
  ).toHaveText("pull");
});
