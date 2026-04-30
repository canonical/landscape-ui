import {
  API_URL,
  API_URL_DEB_ARCHIVE,
  API_URL_OLD,
  MSW_ENDPOINTS_TO_INTERCEPT,
} from "@/constants";
import type { RequestHandler } from "msw";
import { http, passthrough } from "msw";
import { setupWorker } from "msw/browser";
import fallbackHandlers from "./server/handlers";

const handlers: RequestHandler[] = [
  http.all("*", ({ request }) => {
    if (
      !request.url.includes(API_URL) &&
      !request.url.includes(API_URL_OLD) &&
      !request.url.includes(API_URL_DEB_ARCHIVE)
    ) {
      return passthrough();
    }

    if (request.url.match(/\.(ts|tsx|scss)/)) {
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

  http.all("*", ({ request }) => {
    console.warn("MSW: No handler matched, passing through:", request.url);
    return passthrough();
  }),
];

export const worker = setupWorker(...handlers);
