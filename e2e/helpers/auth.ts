import type { Page } from "@playwright/test";
import { navigateTo } from "./navigation";

export async function login(
  page: Page,
  email: string,
  password: string,
  params?: Record<string, string>,
): Promise<void> {
  await navigateTo(page, "/login", params);

  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
}
