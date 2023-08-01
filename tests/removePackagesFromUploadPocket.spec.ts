import { expect, test } from "@playwright/test";

test("should remove packages from upload pocket", async ({ page }) => {
  await page.route(/\?action=RemovePackagesFromPocket/, (route) => {
    expect(route.request().url().includes("test-upload-pocket")).toBeTruthy();
    expect(
      route
        .request()
        .url()
        .includes(
          "packages.1=package+3&packages.2=package+4&packages.3=package+5"
        )
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
        "main/amd64": [
          ["package 1", "1.1"],
          ["package 2", "1.2"],
          ["package 3", "1.3"],
          ["package 4", "1.4"],
          ["package 5", "1.5"],
        ],
      }),
    });
  });

  await page.goto("/");

  await page
    .getByRole("button", {
      name: "List test-upload-pocket pocket of test-distro/test-snapshot",
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "test-snapshot test-upload-pocket" })
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
      name: "Remove selected packages from test-upload-pocket pocket of test-distro/test-snapshot",
    })
  ).toBeDisabled();

  await page.getByText("Package", { exact: true }).click();

  for (const row of rows) {
    await expect(row.getByRole("checkbox")).toBeChecked();
  }

  await page.getByText("package 1").click();
  await page.getByText("package 2").click();

  await page
    .getByRole("button", {
      name: "Remove selected packages from test-upload-pocket pocket of test-distro/test-snapshot",
    })
    .click();
});
