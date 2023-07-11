import { expect, test } from "@playwright/test";

test("should remove test distribution pockets", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", {
      name: "List updates pocket of test-distro/test-mirror-jammy",
    })
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Remove updates pocket of test-distro/test-mirror-jammy",
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Deleting pocket" })
  ).toBeVisible();
  await expect(
    page.getByText(
      "Do you really want to delete updates pocket from test-mirror-jammy series of tes"
    )
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
  await page
    .getByRole("button", {
      name: "Delete updates pocket of test-distro/test-mirror-jammy",
    })
    .click();
  await expect(
    page.getByRole("button", {
      name: "List updates pocket of test-distro/test-mirror-jammy",
    })
  ).not.toBeVisible();

  await page
    .getByRole("button", {
      name: "List security pocket of test-distro/test-mirror-jammy",
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "test-mirror-jammy security" })
  ).toBeVisible();
  await page
    .getByRole("complementary")
    .getByRole("button", {
      name: "Remove security pocket of test-distro/test-mirror-jammy",
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Deleting pocket" })
  ).toBeVisible();
  await expect(
    page.getByText(
      "Do you really want to delete security pocket from test-mirror-jammy series of te"
    )
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Delete security pocket of test-distro/test-mirror-jammy",
    })
    .click();
  await expect(
    page.getByRole("button", {
      name: "List security pocket of test-distro/test-mirror-jammy",
    })
  ).not.toBeVisible();
});
