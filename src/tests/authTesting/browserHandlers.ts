import {
  API_URL,
  API_URL_DEB_ARCHIVE,
  API_URL_OLD,
  MSW_ENDPOINTS_TO_INTERCEPT,
} from "@/constants";
import type { RequestHandler } from "msw";
import { http, HttpResponse, passthrough } from "msw";
import fallbackHandlers from "../server/handlers";
import type { AuthTestingConfig } from "./config";
import { createAuthTestingHandlers } from "./handlers";

const isApiRequest = (url: string) =>
  [API_URL, API_URL_OLD, API_URL_DEB_ARCHIVE].some((apiUrl) =>
    url.includes(apiUrl),
  );

export const createBrowserHandlers = (
  config: AuthTestingConfig | null,
): RequestHandler[] => [
  http.all("*", ({ request }) => {
    if (!isApiRequest(request.url) || request.url.match(/\.(ts|tsx|scss)/)) {
      return passthrough();
    }

    if (
      config !== null ||
      MSW_ENDPOINTS_TO_INTERCEPT.some((url: string) =>
        request.url.includes(url),
      )
    ) {
      return;
    }

    return passthrough();
  }),
  ...(config === null
    ? []
    : createAuthTestingHandlers(config, undefined, {
        storage: window.sessionStorage,
        pathname: window.location.pathname,
      })),
  ...fallbackHandlers,
  http.all("*", ({ request }) => {
    if (config !== null && isApiRequest(request.url)) {
      console.error(
        "MSW auth testing: missing API handler:",
        request.method,
        request.url,
      );
      return HttpResponse.json(
        {
          error: "MissingMockHandler",
          message: `No MSW handler for ${request.method} ${new URL(request.url).pathname}`,
        },
        { status: 501 },
      );
    }
    console.warn("MSW: No handler matched, passing through:", request.url);
    return passthrough();
  }),
];
