import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("should remove test distribution if present", async ({ page }) => {
  await expect(
    page
      .getByRole("button", {
        name: /add series to/i,
      })
      .first()
      .or(
        page.getByText(
          "To create a new mirror you must first create a distribution"
        )
      )
  ).toBeVisible();

  const removeDistributionButton = page.getByRole("button", {
    name: "Remove test-distro distribution",
  });

  if (!(await removeDistributionButton.isVisible())) {
    test.skip();
  }

  await removeDistributionButton.click();

  await page
    .getByRole("dialog", { name: "Removing test-distro distribution" })
    .getByRole("button", { name: "Remove test-distro distribution" })
    .click();

  await expect(
    page.getByRole("dialog", { name: "Removing test-distro distribution" })
  ).not.toBeVisible();

  await expect(
    page.getByRole("heading", { name: "test-distro" })
  ).not.toBeVisible();
});

test("should remove test GPG key if present", async ({ page }) => {
  await page.getByRole("button", { name: "Repositories" }).click();
  await page.getByRole("link", { name: "GPG Keys" }).click();

  await expect(
    page
      .getByRole("button", {
        name: /Remove/i,
      })
      .first()
      .or(page.getByText("You haven’t added any GPG keys yet."))
  ).toBeVisible();

  const removeGpgKeyButton = page.getByRole("button", {
    name: "Remove test-gpg-key GPG key",
  });

  if (!(await removeGpgKeyButton.isVisible())) {
    test.skip();
  }

  await removeGpgKeyButton.click();

  await page
    .getByRole("dialog", { name: "Deleting test-gpg-key GPG key" })
    .getByRole("button", { name: "Delete test-gpg-key GPG key" })
    .click();

  await expect(
    page.getByRole("dialog", { name: "Deleting test-gpg-key GPG key" })
  ).not.toBeVisible();

  await expect(removeGpgKeyButton).not.toBeVisible();
});

test("should remove test APT source if present", async ({ page }) => {
  await page.getByRole("button", { name: "Repositories" }).click();
  await page.getByRole("link", { name: "APT Sources" }).click();

  await expect(
    page
      .getByRole("button", {
        name: /Remove/i,
      })
      .first()
      .or(page.getByText("You haven’t added any APT sources yet."))
  ).toBeVisible();

  const removeAptSourceButton = page.getByRole("button", {
    name: "Remove test-apt-source APT source",
  });

  if (!(await removeAptSourceButton.isVisible())) {
    test.skip();
  }

  await removeAptSourceButton.click();

  await page
    .getByRole("dialog", { name: "Deleting test-apt-source APT source" })
    .getByRole("button", { name: "Delete test-apt-source APT source" })
    .click();

  await expect(
    page.getByRole("dialog", { name: "Deleting test-apt-source APT source" })
  ).not.toBeVisible();

  await expect(removeAptSourceButton).not.toBeVisible();
});

test("should remove test repository profile if present", async ({ page }) => {
  await page.getByRole("button", { name: "Repositories" }).click();
  await page.getByRole("link", { name: "Profiles" }).click();

  await expect(
    page
      .getByRole("button", {
        name: /Remove/i,
      })
      .first()
      .or(page.getByText("You haven’t added any profile yet."))
  ).toBeVisible();

  const removeRepositoryProfileButton = page.getByRole("button", {
    name: "Remove test-profile repository profile",
  });

  if (!(await removeRepositoryProfileButton.isVisible())) {
    test.skip();
  }

  await removeRepositoryProfileButton.click();

  await page
    .getByRole("dialog", { name: "Deleting test-profile repository profile" })
    .getByRole("button", { name: "Delete test-profile repository profile" })
    .click();

  await expect(
    page.getByRole("dialog", {
      name: "Deleting test-profile repository profile",
    })
  ).not.toBeVisible();

  await expect(removeRepositoryProfileButton).not.toBeVisible();
});
