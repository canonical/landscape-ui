import type { Page } from "@playwright/test";

const DEV_PORT = 5173;
const PREVIEW_PORT = 4173;
const PORT = process.env.CI ? PREVIEW_PORT : DEV_PORT;
const ROOT_PATH = process.env.VITE_ROOT_PATH ?? "/";
const BASE_URL = `http://localhost:${PORT}`;

export async function navigateTo(
  page: Page,
  path: string,
  params?: Record<string, string>,
): Promise<void> {
  const urlWithRootPath = `${ROOT_PATH}${path.replace(/^\//, "")}`;
  const url = new URL(urlWithRootPath, BASE_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  await page.goto(url.toString().replace(BASE_URL, ""));
}

export async function navigateToSidebarLink(
  page: Page,
  name: string,
): Promise<void> {
  await page
    .getByRole("link", {
      name,
    })
    .click();
}

export async function clickSidebarButton(
  page: Page,
  name: string,
): Promise<void> {
  await page
    .getByRole("button", {
      name,
    })
    .click();
}
