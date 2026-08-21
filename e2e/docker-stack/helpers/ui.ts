import type { Page } from "@playwright/test";

/** Suppress the first-run welcome modal that otherwise intercepts page clicks. */
export async function dismissWelcomePopup(page: Page): Promise<void> {
  await page.addInitScript(() => {
    window.localStorage.setItem("_landscape_isWelcomePopupClosed", "true");
  });
}
