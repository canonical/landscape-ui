import { API_URL, API_URL_OLD } from "@/constants";
import type { APTSource, GetAPTSourcesParams } from "@/features/apt-sources";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { aptSources } from "@/tests/mocks/apt-sources";
import {
  isAction,
  shouldApplyEndpointStatus,
} from "@/tests/server/handlers/_helpers";
import { http, HttpResponse } from "msw";
import {
  createEndpointStatusError,
  createEndpointStatusNetworkError,
} from "./_constants";

export default [
  http.get<never, GetAPTSourcesParams, APTSource[]>(
    API_URL_OLD,
    ({ request }) => {
      if (!isAction(request, "GetAPTSources")) {
        return;
      }

      return HttpResponse.json(aptSources);
    },
  ),

  http.delete(`${API_URL}repository/apt-source/:sourceId`, () => {
    if (shouldApplyEndpointStatus("repository/apt-source/:sourceId")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusNetworkError();
      }
    }

    return HttpResponse.json();
  }),

  http.get(`${API_URL}repository/apt-source`, () => {
    if (shouldApplyEndpointStatus("repository/apt-source")) {
      const { status } = getEndpointStatus();

      if (status === "error") {
        throw createEndpointStatusError();
      }

      if (status === "empty") {
        return HttpResponse.json({ results: [] });
      }
    }

    return HttpResponse.json({ results: aptSources });
  }),
];
