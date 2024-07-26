import { expect, test } from "@playwright/test";

test("should remove packages from upload pocket", async ({ page }) => {
  await page.goto("/repositories/mirrors");

  await page.route(/\?action=RemovePackagesFromPocket/, (route) => {
    expect(route.request().url().includes("test-upload-pocket")).toBeTruthy();
    expect(
      route
        .request()
        .url()
        .includes(
          "packages.1=package+3&packages.2=package+4&packages.3=package+5",
        ),
    ).toBeTruthy();

    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: "success",
        message: "Removing packages started",
      }),
    });
  });

  await page.route(/\?action=ListPocket/, (route) => {
    expect(route.request().url().includes("test-upload-pocket")).toBeTruthy();
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        count: 5,
        next: null,
        previous: null,
        results: [
          {
            name: "package 1",
            version: "1.1",
            component: "main",
            arch: "amd64",
            udeb: false,
          },
          {
            name: "package 2",
            version: "1.2",
            component: "main",
            arch: "amd64",
            udeb: false,
          },
          {
            name: "package 3",
            version: "1.3",
            component: "main",
            arch: "amd64",
            udeb: false,
          },
          {
            name: "package 4",
            version: "1.4",
            component: "main",
            arch: "amd64",
            udeb: false,
          },
          {
            name: "package 5",
            version: "1.5",
            component: "main",
            arch: "amd64",
            udeb: false,
          },
        ],
      }),
    });
  });

  await page.goto("/repositories/mirrors");

  await page
    .getByRole("button", {
      name: "List test-upload-pocket pocket of test-e2e-distro/test-derived-series",
    })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "test-derived-series test-upload-pocket",
    }),
  ).toBeVisible();

  await expect(page.getByRole("complementary").getByRole("row")).toHaveCount(6);

  const rows = await page
    .getByRole("complementary")
    .getByRole("row")
    .filter({ hasNotText: "version" })
    .all();

  for (const row of rows) {
    await expect(row.getByRole("checkbox")).not.toBeChecked();
  }

  await expect(
    page.getByRole("button", {
      name: "Remove selected packages from test-upload-pocket pocket of test-e2e-distro/test-derived-series",
    }),
  ).toBeDisabled();

  await page
    .getByRole("row", { name: "Toggle all Package Version" })
    .locator("label")
    .click();

  for (const row of rows) {
    await expect(row.getByRole("checkbox")).toBeChecked();
  }

  await page.getByText("package 1").click();
  await page.getByText("package 2").click();

  await page
    .getByRole("button", {
      name: "Remove selected packages from test-upload-pocket pocket of test-e2e-distro/test-derived-series",
    })
    .click();
});
