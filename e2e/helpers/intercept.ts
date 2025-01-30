import { Page, Request } from "@playwright/test";

export async function interceptRequest(
  page: Page,
  method: "POST" | "PATCH" | "PUT" | "DELETE",
  endpoint: string,
  expectedPayload?: Record<string, any>,
  mockResponse?: Record<string, any>,
) {
  await page.route(`${endpoint}`, async (route) => {
    const request = route.request();

    if (request.method() === method) {
      // Validate payload if provided
      if (expectedPayload) {
        const requestBody = request.postDataJSON();

        if (JSON.stringify(requestBody) !== JSON.stringify(expectedPayload)) {
          throw new Error(
            `Payload mismatch. Expected ${JSON.stringify(expectedPayload)}, but got ${JSON.stringify(requestBody)}`,
          );
        }
      }

      if (mockResponse) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockResponse),
        });
      }
    }

    await route.continue();
  });
}

export async function interceptRequest2(
  page: Page,
  urlPattern: string | RegExp,
  method = "GET",
  payload?: object,
): Promise<Request> {
  return page.waitForRequest((req) => {
    const matchesUrl = req.url().match(urlPattern) !== null;
    const matchesMethod = req.method() === method;
    const matchesPayload = payload
      ? JSON.stringify(req.postData()) === JSON.stringify(payload)
      : true;
    return matchesUrl && matchesMethod && matchesPayload;
  });
}
