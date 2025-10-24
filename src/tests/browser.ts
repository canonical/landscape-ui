import { API_URL, API_URL_OLD, MSW_ENDPOINTS_TO_INTERCEPT } from "@/constants";
import type { RequestHandler } from "msw";
import { http, HttpResponse, passthrough } from "msw";
import { setupWorker } from "msw/browser";
import fallbackHandlers from "./server/handlers";

const handlers: RequestHandler[] = [
  http.all("*", ({ request }) => {
    if (request.url.includes("sentry.is.canonical.com")) {
      return passthrough();
    }

    return;
  }),
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

    return passthrough();
  }),

  ...fallbackHandlers,

  http.all("*", async ({ request }) => {
    console.log("Request not handled:", request.url);
    return new HttpResponse(null, { status: 404 });
  }),
];

export const worker = setupWorker(...handlers);
