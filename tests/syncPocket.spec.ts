import { expect, test } from "@playwright/test";

test("should sync mirror pocket", async ({ page }) => {
  await page.route(/\?action=SyncMirrorPocket/, (route) => {
    expect(route.request().url().includes("test-mirror-pocket")).toBeTruthy();
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: "success",
        message: "Synchronization started",
      }),
    });
  });

  await page.goto("/");

  await page
    .getByRole("button", {
      name: "Synchronize test-mirror-pocket pocket of test-distro/test-snapshot",
    })
    .click();
  await expect(
    page.getByRole("dialog", {
      name: "Synchronizing test-mirror-pocket pocket",
    })
  ).toBeVisible();
  await expect(
    page.getByText("Do you want to synchronize packages?")
  ).toBeVisible();

  await page
    .getByRole("dialog", { name: "Synchronizing test-mirror-pocket pocket" })
    .getByRole("button", {
      name: "Synchronize test-mirror-pocket pocket of test-distro/test-snapshot",
    })
    .click();

  await page
    .getByRole("button", {
      name: "List test-mirror-pocket pocket of test-distro/test-snapshot",
    })
    .click();
  await page
    .getByRole("complementary")
    .getByRole("button", {
      name: "Synchronize test-mirror-pocket pocket of test-distro/test-snapshot",
    })
    .click();
});
