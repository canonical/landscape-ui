import { API_URL, API_URL_OLD } from "@/constants";
import type { RequestHandler } from "msw";
import { http, HttpResponse, passthrough } from "msw";
import { setupWorker } from "msw/browser";
import endpointsToIntercept from "./endpointsToIntercept.json";
import fallbackHandlers from "./server/handlers";

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

    return passthrough();
  }),

  ...fallbackHandlers,

  http.all("*", async ({ request }) => {
    console.log("Request not handled:", request.url);
    return new HttpResponse(null, { status: 404 });
  }),
];

export const worker = setupWorker(...handlers);
