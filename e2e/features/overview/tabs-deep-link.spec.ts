import type { Page } from "@playwright/test";
import { expect, test } from "../../support/fixtures/auth";
import { navigateTo } from "../../support/helpers/navigation";

const upgradesTabs = (page: Page) =>
  page.getByRole("navigation", { name: "Upgrades available" });
const activitiesTabs = (page: Page) =>
  page.getByRole("navigation", { name: "Activities" });

test("restores both Overview table tabs from a shared URL", async ({
  authenticatedPage: page,
}) => {
  await navigateTo(
    page,
    "/overview?tab=upgrades:usns&tab=activities:inProgress",
  );

  await expect(
    upgradesTabs(page).getByRole("link", { name: "USNs" }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    activitiesTabs(page).getByRole("link", { name: "In progress" }),
  ).toHaveAttribute("aria-current", "page");

  await page.reload();

  await expect(
    upgradesTabs(page).getByRole("link", { name: "USNs" }),
  ).toHaveAttribute("aria-current", "page");

  // Selecting a slot's default tab removes only that slot's value.
  await upgradesTabs(page).getByRole("link", { name: "Instances" }).click();

  await expect(
    upgradesTabs(page).getByRole("link", { name: "Instances" }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    activitiesTabs(page).getByRole("link", { name: "In progress" }),
  ).toHaveAttribute("aria-current", "page");
  expect(new URL(page.url()).searchParams.getAll("tab")).toEqual([
    "activities:inProgress",
  ]);
});

test("falls back to each slot's default tab for unknown values", async ({
  authenticatedPage: page,
}) => {
  await navigateTo(page, "/overview?tab=upgrades:nope&tab=bogus:usns");

  await expect(
    upgradesTabs(page).getByRole("link", { name: "Instances" }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    activitiesTabs(page).getByRole("link", { name: "Requires approval" }),
  ).toHaveAttribute("aria-current", "page");
});
