import { expect, test } from "@playwright/test";
import { e2eCheckSitePanelTitle, e2eCloseSidePanel } from "./helpers";

test("should remove test distribution pockets", async ({ page }) => {
  const responseBody = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };

  await page.route(/\?action=RemovePocket/, (route) => {
    if (!route.request().url().includes("name=security")) {
      return route.continue();
    }

    expect(
      route
        .request()
        .url()
        .includes("distribution=test-e2e-distro&series=test-mirror-jammy"),
    ).toBeTruthy();

    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(responseBody),
    });
  });

  await page.goto("/repositories/mirrors");
  await expect(
    page.getByRole("button", {
      name: "List updates pocket of test-e2e-distro/test-mirror-jammy",
    }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Remove updates pocket of test-e2e-distro/test-mirror-jammy",
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Deleting pocket" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Do you really want to delete updates pocket from test-mirror-jammy series of tes",
    ),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
  await page
    .getByRole("button", {
      name: "Delete updates pocket of test-e2e-distro/test-mirror-jammy",
    })
    .click();
  await expect(
    page.getByRole("button", {
      name: "List updates pocket of test-e2e-distro/test-mirror-jammy",
    }),
  ).not.toBeVisible();

  await page
    .getByRole("button", {
      name: "List security pocket of test-e2e-distro/test-mirror-jammy",
    })
    .click();

  await e2eCheckSitePanelTitle(page, "test-mirror-jammy security");

  await e2eCloseSidePanel(page);

  await page
    .getByRole("button", {
      name: "Remove security pocket of test-e2e-distro/test-mirror-jammy",
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Deleting pocket" }),
  ).toBeVisible();
  await expect(
    page.getByText(
      "Do you really want to delete security pocket from test-mirror-jammy series of te",
    ),
  ).toBeVisible();
  const responsePromise = page.waitForResponse("**/*");
  await page
    .getByRole("button", {
      name: "Delete security pocket of test-e2e-distro/test-mirror-jammy",
    })
    .click();
  const response = await responsePromise;
  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual(responseBody);
});
