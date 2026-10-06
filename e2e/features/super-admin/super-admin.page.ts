import type { Locator, Page } from "@playwright/test";
import { expect } from "../../support/fixtures/auth";
import { navigateTo } from "../../support/helpers/navigation";

export class SuperAdminPage {
  readonly page: Page;

  /** The "Super admin" entry in the normal view's sidebar. */
  readonly entryLink: Locator;
  /** The super admin mode's own sidebar navigation. */
  readonly navigation: Locator;
  /** The bar framing an account entered for support. */
  readonly supportSession: Locator;
  readonly accountRows: Locator;
  readonly personRows: Locator;
  readonly invitationRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.entryLink = page.getByRole("link", { name: "Super admin" });
    this.navigation = page.getByRole("navigation", { name: "Super admin" });
    this.supportSession = page.getByRole("region", {
      name: "Support session",
    });
    this.accountRows = page.getByRole("row", { name: / account row$/ });
    this.personRows = page.getByRole("row", { name: / user row$/ });
    this.invitationRows = page.getByRole("row", { name: / invitation row$/ });
  }

  async goToAccounts(): Promise<void> {
    await navigateTo(this.page, "/super-admin/accounts");
  }

  async goToAccount(name: string): Promise<void> {
    await navigateTo(this.page, `/super-admin/accounts/${name}`);
  }

  async goToPeople(): Promise<void> {
    await navigateTo(this.page, "/super-admin/people");
  }

  accountRow(name: string): Locator {
    return this.page.getByRole("row", { name: `${name} account row` });
  }

  async openRowActions(name: string): Promise<void> {
    await this.page.getByRole("button", { name: `${name} actions` }).click();
  }

  /** Submits `text` in the page's search box and waits for the page to take it. */
  async search(text: string): Promise<void> {
    const searchBox = this.page.getByRole("searchbox");

    await searchBox.fill(text);
    await searchBox.press("Enter");

    // The box is reset from the page params once they change; typing before
    // that would be undone.
    await expect(this.page).toHaveURL(
      new RegExp(`search=${encodeURIComponent(text)}`),
    );
  }
}
