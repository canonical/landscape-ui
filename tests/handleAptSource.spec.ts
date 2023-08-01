import { expect, test } from "@playwright/test";

test("should handle APT source", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "APT Sources" }).click();
  expect(page.url().includes("apt-sources")).toBeTruthy();
  await expect(
    page.getByRole("heading", { name: "APT Sources" })
  ).toBeVisible();
  await page.getByRole("button", { name: "Create APT source" }).click();
  await expect(
    page.getByRole("heading", { name: "Create APT source" })
  ).toBeVisible();
  await page.locator('input[name="name"]').fill("test-apt-source");
  await page
    .locator('input[name="apt_line"]')
    .fill("deb http://archive.ubuntu.com/ubuntu jammy main");
  await page.locator('select[name="gpg_key"]').selectOption("sign-key");
  await page.locator('select[name="access_group"]').selectOption("global");
  await page
    .getByRole("button", { name: "Create APT Source", exact: true })
    .click();

  await expect(page.getByText("test-apt-source")).toBeVisible();

  const newAptSourceRow = page
    .getByRole("row")
    .filter({ has: page.getByRole("gridcell", { name: "test-apt-source" }) });

  await expect(
    newAptSourceRow.getByRole("gridcell", { name: "Access group" })
  ).toHaveText("global");

  await expect(
    newAptSourceRow.getByRole("gridcell", { name: "Line" })
  ).toHaveText("deb http://archive.ubuntu.com/ubuntu jammy main");

  await page
    .getByRole("button", { name: "Remove test-apt-source APT source" })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Deleting test-apt-source APT source" })
  ).toBeVisible();
  await expect(
    page.getByText(
      "Are you sure? This action is permanent and can not be undone."
    )
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Delete test-apt-source APT source" })
    .click();

  await expect(newAptSourceRow).toHaveCount(0);
});
