import { API_URL, API_URL_OLD } from "@/constants";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import { http, HttpResponse } from "msw";
import { generatePaginatedResponse, isAction } from "./_helpers";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { ENDPOINT_STATUS_API_ERROR } from "./_constants";

export default [
  http.get(`${API_URL}repositoryprofiles`, ({ request }) => {
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

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "RemoveRepositoryProfile")) {
      return;
    }

    const endpointStatus = getEndpointStatus();
    if (endpointStatus.status === "error") {
      throw ENDPOINT_STATUS_API_ERROR;
    }

    return HttpResponse.json();
  }),
];
