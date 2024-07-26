import { Page } from "@playwright/test";

export const e2eCloseSidePanel = (page: Page) =>
  page
    .getByRole("button", {
      name: /close side panel/i,
    })
    .click();
