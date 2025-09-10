import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import type { GetPackagesParams, Package } from "@/features/packages";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { getInstancePackages, packages } from "@/tests/mocks/packages";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { generatePaginatedResponse } from "./_helpers";

export default [
  http.get<never, GetPackagesParams, ApiPaginatedResponse<Package>>(
    `${API_URL}packages`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw new HttpResponse(null, { status: 500 });
      }

      const url = new URL(request.url);
      const limit = Number(url.searchParams.get("limit"));
      const offset = Number(url.searchParams.get("offset")) || 0;

      return HttpResponse.json(
        generatePaginatedResponse<Package>({
          data: packages,
          limit,
          offset,
        }),
      );
    },
  ),

  http.get(`${API_URL}computers/:id/packages`, ({ params, request }) => {
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get("limit"));
    const offset = Number(url.searchParams.get("offset")) || 0;
    const instanceId = Number(params.id);

    const instancePackages = getInstancePackages(instanceId);

    return HttpResponse.json(
      generatePaginatedResponse({
        data: instancePackages,
        limit,
        offset,
      }),
    );
  }),
];
