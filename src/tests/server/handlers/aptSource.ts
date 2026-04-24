import { API_URL, API_URL_OLD } from "@/constants";
import type { APTSource, GetAPTSourcesParams } from "@/features/apt-sources";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { aptSources } from "@/tests/mocks/apt-sources";
import { isAction } from "@/tests/server/handlers/_helpers";
import { http, HttpResponse } from "msw";
import { getEndpointStatusApiError } from "./_constants";

export default [
  http.get<never, GetAPTSourcesParams, APTSource[]>(
    API_URL_OLD,
    ({ request }) => {
      if (!isAction(request, "GetAPTSources")) {
        return;
      }

      const endpointStatus = getEndpointStatus();

      if (
        endpointStatus.status === "error" &&
        endpointStatus.path === "GetAPTSources"
      ) {
        throw getEndpointStatusApiError();
      }

      return HttpResponse.json(aptSources);
    },
  ),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "CreateAPTSource")) {
      return;
    }

    const endpointStatus = getEndpointStatus();

    if (
      endpointStatus.status === "error" &&
      endpointStatus.path === "CreateAPTSource"
    ) {
      throw getEndpointStatusApiError();
    }

    const url = new URL(request.url);
    const name = url.searchParams.get("name") ?? "new-source";
    return HttpResponse.json({
      id: 99,
      name,
      line: url.searchParams.get("apt_line") ?? "",
      gpg_key: url.searchParams.get("gpg_key") ?? "",
      access_group: url.searchParams.get("access_group") ?? "global",
      profiles: [],
    });
  }),

  http.delete(`${API_URL}repository/apt-source/:sourceId`, () => {
    const endpointStatus = getEndpointStatus();

    if (
      !endpointStatus.path ||
      (endpointStatus.path &&
        endpointStatus.path === "repository/apt-source/:sourceId")
    ) {
      if (endpointStatus.status === "error") {
        throw getEndpointStatusApiError();
      }
    }

    return HttpResponse.json();
  }),

  http.get(`${API_URL}repository/apt-source`, () => {
    const endpointStatus = getEndpointStatus();

    if (
      !endpointStatus.path ||
      (endpointStatus.path && endpointStatus.path === "repository/apt-source")
    ) {
      if (endpointStatus.status === "error") {
        throw getEndpointStatusApiError();
      }

      if (endpointStatus.status === "empty") {
        return HttpResponse.json({ results: [] });
      }
    }

    return HttpResponse.json({ results: aptSources });
  }),
];
