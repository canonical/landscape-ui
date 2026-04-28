import type { Locator, Page } from "@playwright/test";
import { basePage } from "../../support/pages/basePage";

export class LoginPage extends basePage {
  readonly page: Page;
  readonly identifierInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.identifierInput = page.locator('input[name="identifier"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator("[type=submit]", { hasText: "Sign in" });
  }

  async login(identifier: string, password: string): Promise<void> {
    await this.identifierInput.fill(identifier);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
