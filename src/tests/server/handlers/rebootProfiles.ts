import { API_URL } from "@/constants";
import { rebootProfiles } from "@/tests/mocks/rebootProfiles";
import { http, HttpResponse } from "msw";
import { generatePaginatedResponse } from "./_helpers";
import { getEndpointStatus } from "@/tests/controllers/controller";

export default [
  http.get(`${API_URL}rebootprofiles`, ({ request }) => {
    const { searchParams } = new URL(request.url);
    const endpointStatus = getEndpointStatus();

    const search = searchParams.get("search")?.toLowerCase() ?? "";
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (
      !endpointStatus.path ||
      endpointStatus.path.includes("rebootprofiles")
    ) {
      if (endpointStatus.status === "error") {
        throw new HttpResponse(null, { status: 500 });
      }
      if (endpointStatus.status === "empty") {
        return HttpResponse.json({
          results: [],
          count: 0,
          next: null,
          previous: null,
        });
      }
    }

    return HttpResponse.json(
      generatePaginatedResponse({
        data: rebootProfiles,
        limit,
        offset,
        search,
      }),
    );
  }),

  http.post(`${API_URL}rebootprofiles`, async () => {
    return HttpResponse.json(rebootProfiles[0], { status: 201 });
  }),

  http.patch(`${API_URL}rebootprofiles/:id`, async ({ params }) => {
    const id = Number(params.id);
    const profile = rebootProfiles.find((p) => p.id === id);

    if (!profile) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(profile);
  }),

  http.delete(`${API_URL}rebootprofiles/:id`, ({ params }) => {
    const id = Number(params.id);
    const profile = rebootProfiles.find((p) => p.id === id);

    if (!profile) {
      return new HttpResponse(null, { status: 404 });
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
