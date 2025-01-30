import { expect } from "../fixtures/auth";
import { Page } from "@playwright/test";

export class _basePage {
  constructor(public readonly page: Page) {}

  async checkPageHeading(title: string): Promise<void> {
    await this.page.waitForSelector("h1");
    const heading = await this.page.locator("h1").innerText();
    expect(heading).toBe(title);
  }
}
