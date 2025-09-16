import { API_URL, API_URL_OLD } from "@/constants";
import type { APTSource, GetAPTSourcesParams } from "@/features/apt-sources";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { aptSources } from "@/tests/mocks/apt-sources";
import { isAction } from "@/tests/server/handlers/_helpers";
import { http, HttpResponse } from "msw";
import { ENDPOINT_STATUS_API_ERROR } from "./_constants";

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
    const endpointStatus = getEndpointStatus();

    if (
      !endpointStatus.path ||
      (endpointStatus.path &&
        endpointStatus.path === "repository/apt-source/:sourceId")
    ) {
      if (endpointStatus.status === "error") {
        throw HttpResponse.json(ENDPOINT_STATUS_API_ERROR, { status: 500 });
      }
    }

    return HttpResponse.json();
  }),

  http.get(`${API_URL}repository/apt-source`, () => {
    return HttpResponse.json({ results: aptSources });
  }),
];
