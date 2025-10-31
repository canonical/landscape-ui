import { http, HttpResponse } from "msw";
import { API_URL, API_URL_OLD } from "@/constants";
import type { GetPackagesParams, Package } from "@/features/packages";
import type { Activity } from "@/features/activities";
import { getEndpointStatus } from "@/tests/controllers/controller";
import {
  downgradePackageVersions,
  getInstancePackages,
  packages,
} from "@/tests/mocks/packages";
import { activities } from "@/tests/mocks/activity";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { generatePaginatedResponse, isAction } from "./_helpers";

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
    const search = url.searchParams.get("search") || "";
    const instanceId = Number(params.id);

    const instancePackages = getInstancePackages(instanceId);

    return HttpResponse.json(
      generatePaginatedResponse({
        data: instancePackages,
        limit,
        offset,
        search,
        searchFields: ["name"],
      }),
    );
  }),

  http.get(
    `${API_URL}computers/:id/packages/installed/:packageName/downgrades`,
    () => {
      return HttpResponse.json({
        results: downgradePackageVersions,
      });
    },
  ),

  http.post<never, never, Activity>(
    `${API_URL}computers/:id/packages/installed`,
    async () => {
      return HttpResponse.json<Activity>(activities[0]);
    },
  ),

  http.post<never, never, Activity>(`${API_URL}packages`, async () => {
    return HttpResponse.json<Activity>(activities[0]);
  }),

  http.get<never, never, Activity>(API_URL_OLD, async ({ request }) => {
    if (!isAction(request, "UpgradePackages")) {
      return;
    }

    return HttpResponse.json<Activity>(activities[0]);
  }),
];
