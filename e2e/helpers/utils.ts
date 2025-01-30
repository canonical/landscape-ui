import { Page } from "@playwright/test";

export async function waitForLoadingSpinner(page: Page): Promise<void> {
  await page.waitForSelector(".spinner", { state: "hidden" });
}

export async function waitForEmptyState(page: Page): Promise<void> {
  await page.waitForSelector(".empty-state", { state: "visible" });
}

export async function waitForSuccessToast(page: Page): Promise<void> {
  await page.waitForSelector(".toast-success", { state: "visible" });
}

export async function waitForErrorToast(page: Page): Promise<void> {
  await page.waitForSelector(".toast-error", { state: "visible" });
}

export async function waitForInfoToast(page: Page): Promise<void> {
  await page.waitForSelector(".toast-info", { state: "visible" });
}

export async function waitForEnvironmentError(page: Page): Promise<void> {
  await page.waitForSelector("text=Environment Error", { state: "visible" });
}

export async function closeWelcomeModal(page: Page): Promise<void> {
  await page.click("button:has-text('Got it')");
}
