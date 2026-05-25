import { http, HttpResponse } from "msw";
import { API_URL_OLD } from "@/constants";
import { isAction } from "./_helpers";
import { savedSearches } from "@/tests/mocks/savedSearches";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { createEndpointStatusError } from "./_constants";

export default [
  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetSavedSearches")) {
      return;
    }

    return HttpResponse.json(savedSearches);
  }),

  http.post(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "CreateSavedSearch")) {
      return;
    }

    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "CreateSavedSearch")
    ) {
      throw createEndpointStatusError();
    }

    return HttpResponse.json({
      name: "new-saved-search",
      title: "New Saved Search",
      search: "alert:package-upgrades",
    });
  }),

  http.post(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "EditSavedSearch")) {
      return;
    }

    return HttpResponse.json({
      name: "edited-saved-search",
      title: "Edited Saved Search",
      search: "alert:security-upgrades",
    });
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "RemoveSavedSearch")) {
      return;
    }

    return HttpResponse.json({});
  }),
];
