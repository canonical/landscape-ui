import { expect, test } from "@playwright/test";

test("should edit upload pocket", async ({ page }) => {
  await page.goto("/repositories/mirrors");
  await page
    .getByRole("button", {
      name: "List test-upload-pocket pocket of test-e2e-distro/test-derived-series",
    })
    .click();
  await page
    .getByRole("complementary")
    .getByRole("button", {
      name: "Edit test-upload-pocket pocket of test-e2e-distro/test-derived-series",
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Edit test-upload-pocket pocket" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  await page
    .getByRole("button", {
      name: "Edit test-upload-pocket pocket of test-e2e-distro/test-derived-series",
    })
    .click();
  await expect(
    page.getByRole("heading", { name: "Edit test-upload-pocket pocket" }),
  ).toBeVisible();
  await expect(
    page
      .locator("label")
      .filter({ hasText: "Allow uploaded packages to be unsigned" })
      .getByRole("checkbox"),
  ).toBeChecked();
  await page.getByText("Allow uploaded packages to be unsigned").click();
  await page.getByLabel("Uploader GPG keys").click();
  await page.getByText("test-e2e-gpg-key").click();
  await page.getByLabel("Uploader GPG keys").click();

  const responsePromise = page.waitForResponse((response) =>
    response.request().url().includes("action=AddUploaderGPGKeysToPocket"),
  );
  await page.getByRole("button", { name: "Save changes" }).click();
  const response = await responsePromise;
  expect(response.status()).toBe(200);
  const json = await response.json();
  expect(json).toHaveProperty("upload_allow_unsigned", false);
  expect(json).toHaveProperty("upload_gpg_keys");
  expect(json.upload_gpg_keys).toHaveLength(1);
  expect(json.upload_gpg_keys[0]).toHaveProperty("name", "test-e2e-gpg-key");
  await expect(
    page.getByRole("heading", { name: "Edit test-upload-pocket pocket" }),
  ).not.toBeVisible();
});
