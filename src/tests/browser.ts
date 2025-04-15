import { setupWorker } from "msw/browser";
import type { RequestHandler } from "msw";
import { bypass, http, HttpResponse, passthrough } from "msw";
import fallbackHandlers from "./server/handlers";
import { API_URL, API_URL_OLD, MSW_ENDPOINTS_TO_INTERCEPT } from "@/constants";

const handlers: RequestHandler[] = [
  http.all("*", async ({ request }) => {
    if (!request.url.includes(API_URL) && !request.url.includes(API_URL_OLD)) {
      return passthrough();
    }

    if (
      MSW_ENDPOINTS_TO_INTERCEPT.some((url: string) =>
        request.url.includes(url),
      )
    ) {
      return;
    }

    const response = await fetch(bypass(request));

    if (response.status >= 400) {
      console.warn("Request failed, falling back to mock:", request.url);
      return;
    }

    return passthrough();
  }),

  ...fallbackHandlers,

  http.all("*", async ({ request }) => {
    console.log("Request not handled:", request.url);
    return new HttpResponse(null, { status: 404 });
  }),
];

export const worker = setupWorker(...handlers);
