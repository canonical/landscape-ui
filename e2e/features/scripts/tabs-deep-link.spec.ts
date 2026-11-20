import type { Page } from "@playwright/test";
import { expect, test } from "../../support/fixtures/auth";
import { navigateTo } from "../../support/helpers/navigation";

/**
 * The Scripts page only renders its tab strip when the account has the
 * `script-profiles` feature. Enable it on the real features response so the
 * rest of the flow still runs against the backend.
 */
const enableScriptProfiles = async (page: Page) => {
  await page.route("**/api/v2/features", async (route) => {
    const response = await route.fetch();
    const body = (await response.json()) as {
      results: { key: string; enabled: boolean }[];
    };
    const others = body.results.filter(({ key }) => key !== "script-profiles");

    await route.fulfill({
      response,
      json: {
        ...body,
        results: [...others, { key: "script-profiles", enabled: true }],
      },
    });
  });
};

const scriptsTabs = (page: Page) =>
  page.getByRole("navigation", { name: "Scripts" });

test.beforeEach(async ({ authenticatedPage: page }) => {
  await enableScriptProfiles(page);
});

test("keeps page and side panel tab state side by side", async ({
  authenticatedPage: page,
}) => {
  await navigateTo(page, "/scripts", { tab: "scripts" });

  await page
    .getByRole("button", { name: /^Show details of script/ })
    .first()
    .click();

  const panelTabs = page.getByRole("navigation", { name: "Script details" });
  await panelTabs.getByRole("link", { name: "Version history" }).click();
  await expect(
    panelTabs.getByRole("link", { name: "Version history" }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    scriptsTabs(page).getByRole("link", { name: "Scripts" }),
  ).toHaveAttribute("aria-current", "page");
  expect(new URL(page.url()).searchParams.getAll("tab")).toEqual([
    "scripts",
    "panel:version-history",
  ]);

  // Closing the panel drops only its tab state.
  await page.getByRole("button", { name: "Close side panel" }).click();
  await expect(panelTabs).toHaveCount(0);
  await expect(page).toHaveURL(/\/scripts\?tab=scripts$/);
});

test("falls back to the default tab for an unknown tab value", async ({
  authenticatedPage: page,
}) => {
  await navigateTo(page, "/scripts", { tab: "no-such-tab" });

  await expect(
    scriptsTabs(page).getByRole("link", { name: "Scripts" }),
  ).toHaveAttribute("aria-current", "page");
});

test("keeps tab switches out of the history stack", async ({
  authenticatedPage: page,
}) => {
  await navigateTo(page, "/overview");
  await navigateTo(page, "/scripts");

  await scriptsTabs(page).getByRole("link", { name: "Profiles" }).click();
  await expect(page).toHaveURL(/\/scripts\?tab=profiles$/);

  await page.goBack();
  await expect(page).toHaveURL(/\/overview$/);

  await page.goForward();
  await expect(page).toHaveURL(/\/scripts\?tab=profiles$/);
  await expect(
    scriptsTabs(page).getByRole("link", { name: "Profiles" }),
  ).toHaveAttribute("aria-current", "page");
});
