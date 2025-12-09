import { http, HttpResponse } from "msw";
import { API_URL_OLD } from "@/constants";
import { isAction } from "./_helpers";
import { savedSearches } from "@/tests/mocks/savedSearches";

export default [
  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetSavedSearches")) {
      return;
    }

    return HttpResponse.json(savedSearches);
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "CreateSavedSearch")) {
      return;
    }

    const url = new URL(request.url);
    return HttpResponse.json({
      name: url.searchParams.get("name"),
      title: url.searchParams.get("title"),
      search: url.searchParams.get("search"),
    });
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "EditSavedSearch")) {
      return;
    }

    const url = new URL(request.url);
    return HttpResponse.json({
      name: url.searchParams.get("name"),
      title: url.searchParams.get("title"),
      search: url.searchParams.get("search"),
    });
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "RemoveSavedSearch")) {
      return;
    }

    return HttpResponse.json({});
  }),
];
