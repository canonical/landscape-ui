import { http, HttpResponse } from "msw";
import { API_URL_DEB_ARCHIVE } from "@/constants";
import { publications, publicationTargets } from "@/tests/mocks/publications";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { succeededTask } from "@/tests/mocks/localRepositories";

export default [
  http.get(`${API_URL_DEB_ARCHIVE}publications`, ({ request }) => {
    const url = new URL(request.url);
    const sourceName =
      url.searchParams.get("filter")?.split("=").pop()?.replaceAll('"', "") ?? "";
    const endpointStatus = getEndpointStatus();

    if (endpointStatus.status === "error") {
      throw new HttpResponse(null, { status: 500 });
    }

    if (endpointStatus.status === "empty") {
      return HttpResponse.json({ publications: [] });
    }

    return HttpResponse.json({ publications:
      publications.filter(({ source }) => source === sourceName),
    });
  }),

  http.post(`${API_URL_DEB_ARCHIVE}publications`, () => {
    return HttpResponse.json(publications[0]);
  }),

  http.post(`${API_URL_DEB_ARCHIVE}publications/:publication\\:publish`, () => {
    return HttpResponse.json(succeededTask);
  }),

  http.get(`${API_URL_DEB_ARCHIVE}publicationTargets`, () => {
    return HttpResponse.json({
      publicationTargets: publicationTargets,
    });
  }),
];
