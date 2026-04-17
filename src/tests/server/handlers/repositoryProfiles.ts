import { API_URL } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import type { RepositoryProfile } from "@/features/repository-profiles";
import { http, HttpResponse } from "msw";
import { generatePaginatedResponse } from "./_helpers";

export default [
  http.get(`${API_URL}repositoryprofiles`, ({ request }) => {
    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "repositoryprofiles")
    ) {
      throw new HttpResponse(null, { status: 500 });
    }

    const { searchParams } = new URL(request.url);

    const names =
      searchParams.get("search")?.toLowerCase().split(",") ?? undefined;
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    return HttpResponse.json(
      generatePaginatedResponse({
        data: names
          ? repositoryProfiles.filter((repositoryProfile) =>
              names.includes(repositoryProfile.name),
            )
          : repositoryProfiles,
        limit,
        offset,
      }),
    );
  }),

  http.post(`${API_URL}repositoryprofiles`, async () => {
    return HttpResponse.json(repositoryProfiles[0], { status: 201 });
  }),

  http.put(`${API_URL}repositoryprofiles/:name`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<RepositoryProfile>;
    const profile = repositoryProfiles.find((p) => p.name === params.name);
    if (!profile) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({ ...profile, ...body }, { status: 200 });
  }),
];
