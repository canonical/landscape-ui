import { http, HttpResponse } from "msw";
import type { GetUsnsParams } from "@/features/usns";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { Usn } from "@/types/Usn";
import { API_URL } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { usnPackages, usns } from "@/tests/mocks/usn";
import { activities } from "@/tests/mocks/activity";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import { getEndpointStatusApiError } from "./_constants";

export default [
  http.get<never, GetUsnsParams, ApiPaginatedResponse<Usn>>(
    `${API_URL}usns`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();
      const url = new URL(request.url);

      const limit = Number(url.searchParams.get("limit")) || usns.length;
      const offset = Number(url.searchParams.get("offset")) || 0;
      const search = url.searchParams.get("search") ?? "";

      if (endpointStatus.status === "empty" && endpointStatus.path === "empty-usns") {
        return HttpResponse.json(
          generatePaginatedResponse<Usn>({
            data: [],
            limit,
            offset,
          }),
        );
      }

      return HttpResponse.json(
        generatePaginatedResponse<Usn>({
          data: usns,
          limit,
          offset,
          search,
          searchFields: ["usn"],
        }),
      );
    },
  ),

  http.get(`${API_URL}usns/:usnName`, () => {
    return HttpResponse.json(usnPackages);
  }),

  http.post(`${API_URL}computers/usns/upgrade-packages`, () => {
    const endpointStatus = getEndpointStatus();

    if (endpointStatus.status === "error") {
      throw getEndpointStatusApiError();
    }

    return HttpResponse.json(activities[0]);
  }),

  http.post(`${API_URL}computers/:instanceId/usns/upgrade-packages`, () => {
    const endpointStatus = getEndpointStatus();

    if (endpointStatus.status === "error") {
      throw getEndpointStatusApiError();
    }

    return HttpResponse.json(activities[0]);
  }),

  http.post(`${API_URL}computers/:instanceId/usns/remove-packages`, () => {
    const endpointStatus = getEndpointStatus();

    if (endpointStatus.status === "error") {
      throw getEndpointStatusApiError();
    }

    return HttpResponse.json(activities[0]);
  }),
];
