import { API_URL } from "@/constants";
import type { GetSnapsParams, InstalledSnap } from "@/features/snaps";
import { getEndpointStatus } from "@/tests/controllers/controller";
import {
  availableSnapInfo,
  availableSnaps,
  installedSnaps,
  successfulSnapInstallResponse,
} from "@/tests/mocks/snap";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { http, HttpResponse } from "msw";
import {
  generateFilteredResponse,
  generatePaginatedResponse,
} from "./_helpers";

export default [
  http.get(
    `${API_URL}computers/:computerId/snaps/available`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();
      const url = new URL(request.url);
      const search = url.searchParams.get("name_startswith") ?? "";
      if (endpointStatus.status === "error") {
        return HttpResponse.json(
          {
            error: "InternalServerError",
            message: "Error response",
          },
          {
            status: 500,
          },
        );
      }
      return HttpResponse.json({
        results: generateFilteredResponse(availableSnaps, search, ["name"]),
      });
    },
  ),

  http.get(
    `${API_URL}computers/:computerId/snaps/:name/info`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();
      if (endpointStatus.status === "error") {
        return HttpResponse.json(
          {
            error: "InternalServerError",
            message: "Error response",
          },
          {
            status: 500,
          },
        );
      }

      const url = new URL(request.url);
      const pathParts = url.pathname.split("/");
      const encodedName = pathParts[pathParts.length - 2]; // Get the second to last element
      const name = decodeURIComponent(encodedName);
      return HttpResponse.json(
        availableSnapInfo.find((snap) => snap.name === name)
          ? availableSnapInfo.find((snap) => snap.name === name)
          : {},
      );
    },
  ),
  http.post(`${API_URL}snaps`, async () => {
    const endpointStatus = getEndpointStatus();
    if (endpointStatus.status === "error") {
      return HttpResponse.json(
        {
          error: "InternalServerError",
          message: "Error response",
        },
        {
          status: 500,
        },
      );
    }
    return HttpResponse.json(successfulSnapInstallResponse);
  }),

  http.get<never, GetSnapsParams, ApiPaginatedResponse<InstalledSnap>>(
    `${API_URL}computers/:computerId/snaps/installed`,
    async ({ request }) => {
      const DEFAULT_PAGE_SIZE = 20;
      const endpointStatus = getEndpointStatus();
      const url = new URL(request.url);
      const search = url.searchParams.get("search") ?? "";
      const offset = Number(url.searchParams.get("offset")) || 0;
      const limit = Number(url.searchParams.get("limit")) || DEFAULT_PAGE_SIZE;

      if (endpointStatus.status === "error") {
        throw new HttpResponse(null, { status: 500 });
      }

      return HttpResponse.json(
        generatePaginatedResponse<InstalledSnap>({
          data: endpointStatus.status === "default" ? installedSnaps : [],
          limit,
          offset,
          search,
          searchFields: ["snap.name"],
        }),
      );
    },
  ),
];
