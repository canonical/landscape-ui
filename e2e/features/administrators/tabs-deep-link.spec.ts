import type { Page } from "@playwright/test";
import { expect, test } from "../../support/fixtures/auth";
import { navigateTo } from "../../support/helpers/navigation";

const administratorTabs = (page: Page) =>
  page.getByRole("navigation", { name: "Administrator settings" });

test("opens the Invites tab from a direct link and keeps it after a reload", async ({
  authenticatedPage: page,
}) => {
  await navigateTo(page, "/settings/administrators", { tab: "invites" });

  // The label carries a count badge; the link keeps its text name.
  const invites = administratorTabs(page).getByRole("link", {
    name: /^Invites/,
  });
  await expect(invites).toHaveAttribute("aria-current", "page", {
    timeout: 15_000,
  });

  await page.reload();
  await expect(invites).toHaveAttribute("aria-current", "page", {
    timeout: 15_000,
  });

  await administratorTabs(page)
    .getByRole("link", { name: "Administrators" })
    .click();
  await expect(page).toHaveURL(/tab=administrators/);
  await expect(invites).not.toHaveAttribute("aria-current");
});
