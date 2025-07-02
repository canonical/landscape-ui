import { expect } from "../fixtures/auth";
import type { Page } from "@playwright/test";

export class TablePagination {
  constructor(public readonly page: Page) {}

  async changePageSize(): Promise<void> {
    await this.page.selectOption('select[name="pageSize"]', "50");
    await expect(this.page).toHaveURL(/pageSize=50/);
  }

  async changeCurrentPage(): Promise<void> {
    await this.page.fill('input[name="currentPage"]', "2");
    await this.page.keyboard.press("Enter");
    await expect(this.page).toHaveURL(/currentPage=2/);
  }
}
