import { API_URL, API_URL_OLD } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import type { RepositoryProfile } from "@/features/repository-profiles";
import { http, HttpResponse } from "msw";
import { ENDPOINT_STATUS_API_ERROR } from "./_constants";
import { generatePaginatedResponse, isAction } from "./_helpers";

export default [
  http.get(`${API_URL}repositoryprofiles`, ({ request }) => {
    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "repositoryprofiles")
    ) {
      throw new HttpResponse(null, { status: 500 });
    }

    if (
      endpointStatus.status === "empty" &&
      (!endpointStatus.path || endpointStatus.path === "repositoryprofiles")
    ) {
      return HttpResponse.json(
        generatePaginatedResponse({ data: [], limit: 20, offset: 0 }),
      );
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
    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "repositoryprofiles")
    ) {
      throw ENDPOINT_STATUS_API_ERROR;
    }
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

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "RemoveRepositoryProfile")) {
      return;
    }

    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "RemoveRepositoryProfile")
    ) {
      throw ENDPOINT_STATUS_API_ERROR;
    }

    return HttpResponse.json({ id: 1 }, { status: 200 });
  }),
];

