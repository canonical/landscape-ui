import type { Page } from "@playwright/test";

const STANDALONE_ACCOUNT_URL = "**/standalone-account";

export async function mockStandaloneAccount(
  page: Page,
  exists: boolean,
): Promise<void> {
  await page.route(STANDALONE_ACCOUNT_URL, async (route) => {
    if (route.request().method() !== "GET") {
      return route.continue();
    }

    if (exists) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ exists: true }),
      });
    }

    return route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({
        error: "NotFound",
        message: "Not found.",
        detail: null,
      }),
    });
  });
}
