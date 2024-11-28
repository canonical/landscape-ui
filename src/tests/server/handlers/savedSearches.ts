import { http, HttpResponse } from "msw";
import { API_URL_OLD } from "@/constants";
import { isAction } from "./_helpers";

export default [
  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetSavedSearches")) {
      return;
    }

    return HttpResponse.json([]);
  }),
];
