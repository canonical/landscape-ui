import { expect, test } from "@playwright/test";

test("should create APT source", async ({ page }) => {
  await page.goto("/repositories/mirrors");

  await page.getByRole("link", { name: "APT Sources" }).click();
  expect(page.url().includes("apt-sources")).toBeTruthy();
  await expect(
    page.getByRole("heading", { name: "APT Sources" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Create APT source" }).click();
  await expect(
    page.getByRole("heading", { name: "Create APT source" }),
  ).toBeVisible();
  await page.locator('input[name="name"]').fill("test-e2e-apt-source");
  await page
    .locator('input[name="apt_line"]')
    .fill("deb http://archive.ubuntu.com/ubuntu jammy main");
  await page.locator('select[name="gpg_key"]').selectOption("sign-key");
  await page.locator('select[name="access_group"]').selectOption("global");
  await page
    .getByRole("button", { name: "Create APT Source", exact: true })
    .click();

  await expect(page.getByText("test-e2e-apt-source")).toBeVisible();

  const newAptSourceRow = page.getByRole("row").filter({
    has: page.getByRole("rowheader", { name: "test-e2e-apt-source" }),
  });

  await expect(newAptSourceRow.getByLabel("Access group")).toHaveText("global");

  await expect(newAptSourceRow.getByRole("cell", { name: "Line" })).toHaveText(
    "deb http://archive.ubuntu.com/ubuntu jammy main",
  );
});
