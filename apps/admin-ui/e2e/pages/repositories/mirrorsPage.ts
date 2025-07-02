import type { Page } from "@playwright/test";
import { basePage } from "../basePage";

export class MirrorsPage extends basePage {
  readonly page: Page;

  constructor(page: Page) {
    super(page);
    this.page = page;
  }
}
