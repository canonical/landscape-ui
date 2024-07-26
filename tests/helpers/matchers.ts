import { expect, Page } from "@playwright/test";

export const e2eCheckPageHeading = (page: Page, title: string) =>
  expect(page.getByRole("heading", { name: title })).toBeVisible();

export const e2eCheckSitePanelTitle = (page: Page, title: string) =>
  expect(page.getByRole("heading", { name: title })).toBeVisible();
