import { setupWorker } from "msw/browser";
import type { RequestHandler } from "msw";
import { bypass, http, HttpResponse, passthrough } from "msw";
import fallbackHandlers from "./server/handlers";
import { API_URL, API_URL_OLD } from "@/constants";
import endpointsToIntercept from "./endpointsToIntercept.json";

const handlers: RequestHandler[] = [
  http.all("*", async ({ request }) => {
    if (!request.url.includes(API_URL) && !request.url.includes(API_URL_OLD)) {
      return passthrough();
    }

    if (
      endpointsToIntercept.some((url) => request.url.includes(url)) &&
      request.method === "GET"
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
