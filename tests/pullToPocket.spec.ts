import { expect, test } from "@playwright/test";
import { e2eCheckSitePanelTitle, e2eCloseSidePanel } from "./helpers";

test("should pull packages to test pocket", async ({ page }) => {
  await page.route(/\?action=PullPackagesToPocket/, (route) => {
    expect(route.request().url().includes("test-pull-pocket")).toBeTruthy();
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: "success",
        message: "Pulling packages started",
      }),
    });
  });

  await page.goto("/repositories/mirrors");

  await page
    .getByRole("button", {
      name: "Pull packages to test-pull-pocket pocket of test-e2e-distro/test-derived-series",
    })
    .click();
  await expect(
    page.getByRole("dialog", {
      name: "Pulling packages to test-pull-pocket pocket",
    }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Do you want to pull packages from test-derived-series/test-mirror-pocket?",
    ),
  ).toBeVisible();

  await page
    .getByRole("dialog", {
      name: "Pulling packages to test-pull-pocket pocket",
    })
    .getByRole("button", {
      name: "Pull packages to test-pull-pocket pocket of test-e2e-distro/test-derived-series",
    })
    .click();

  await expect(
    page.getByRole("dialog", {
      name: "Pulling packages to test-pull-pocket pocket",
    }),
  ).not.toBeVisible();

  await page
    .getByRole("button", {
      name: "List test-pull-pocket pocket of test-e2e-distro/test-derived-series",
    })
    .click();

  await e2eCheckSitePanelTitle(page, "test-derived-series test-pull-pocket");

  await e2eCloseSidePanel(page);

  await page
    .getByRole("button", {
      name: "Pull packages to test-pull-pocket pocket of test-e2e-distro/test-derived-series",
    })
    .click();
});
