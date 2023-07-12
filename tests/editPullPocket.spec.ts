import { expect, test } from "@playwright/test";

test("should edit pull pocket", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", {
      name: "Edit test-pull-pocket pocket of test-distro/test-snapshot",
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Edit test-pull-pocket pocket" })
  ).toBeVisible();
  await expect(page.getByRole("textbox")).toHaveValue("");
  await page.getByRole("textbox").fill("apache2,apt");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page
    .getByRole("button", {
      name: "Edit test-pull-pocket pocket of test-distro/test-snapshot",
    })
    .click();
  await expect(page.getByRole("textbox")).toHaveValue("apache2,apt");
});
