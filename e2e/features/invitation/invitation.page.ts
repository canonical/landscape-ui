import type { Locator, Page } from "@playwright/test";
import { basePage } from "../../support/pages/basePage";

export class InvitationPage extends basePage {
  readonly heading: Locator;
  readonly acceptButton: Locator;
  readonly rejectButton: Locator;
  readonly backToLoginButton: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole("heading", { level: 1 });
    this.acceptButton = page.getByRole("button", { name: "Accept" });
    this.rejectButton = page.getByRole("button", { name: "Reject" });
    this.backToLoginButton = page.getByRole("button", {
      name: "Back to login",
    });
    this.emailInput = page.getByLabel("Email");
    this.passwordInput = page.getByLabel("Password");
  }
}
