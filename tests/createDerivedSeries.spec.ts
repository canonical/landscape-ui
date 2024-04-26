import { expect, test } from "@playwright/test";

test("should add test derived series", async ({ page }) => {
  await page.goto("/repositories/mirrors");
  await page
    .locator("div")
    .filter({ hasText: /^test-mirror-xenialDerive seriesNew pocketRemove$/ })
    .getByRole("button", { name: "Derive series" })
    .click();
  await page.getByRole("textbox").fill("test-derived-series");
  await page
    .getByRole("complementary")
    .getByRole("button", { name: "Derive series" })
    .click();
  await expect(
    page.getByRole("heading", { name: "test-derived-series" }),
  ).toBeVisible();
  await expect(
    page.getByText("pulling from test-mirror-xenial/proposes"),
  ).toBeVisible();
  await expect(
    page
      .getByRole("rowgroup")
      .filter({
        has: page.getByRole("button", {
          name: "List proposes pocket of test-e2e-distro/test-derived-series",
        }),
      })
      .getByRole("gridcell", { name: "Mode" }),
  ).toHaveText("pull");
});
