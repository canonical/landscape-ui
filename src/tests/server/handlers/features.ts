import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { features } from "@/tests/mocks/features";
import { getEndpointStatus } from "@/tests/controllers/controller";
import type { Feature } from "@/types/Feature";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";

export default [
  http.get<never, never, ApiPaginatedResponse<Feature>>(
    `${API_URL}features`,
    () => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "empty") {
        return HttpResponse.json({
          results: [],
          count: 0,
          next: null,
          previous: null,
        });
      }

      if (endpointStatus.status === "error") {
        throw new HttpResponse(null, { status: 500 });
      }

      return HttpResponse.json({
        results: features,
        count: features.length,
        next: null,
        previous: null,
      });
    },
  ),
];
