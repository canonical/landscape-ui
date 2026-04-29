import { API_URL } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { repositoryProfiles } from "@/tests/mocks/repositoryProfiles";
import { http, HttpResponse } from "msw";
import { generatePaginatedResponse, shouldApplyEndpointStatus } from "./_helpers";
import { createEndpointStatusNetworkError } from "./_constants";

export default [
  http.get(`${API_URL}repositoryprofiles`, ({ request }) => {
    if (shouldApplyEndpointStatus("repositoryprofiles")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusNetworkError();
      }
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
];
