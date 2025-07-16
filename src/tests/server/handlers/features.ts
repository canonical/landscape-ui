import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { features } from "@/tests/mocks/features";
import { getEndpointStatus } from "@/tests/controllers/controller";
import type { Feature } from "@/types/Feature";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";

export default [
  http.get<never, never, ApiPaginatedResponse<Feature>>(
    `${API_URL}features`,
    () => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "empty") {
        return HttpResponse.json(
          generatePaginatedResponse<Feature>({
            data: [],
            offset: 0,
            limit: 20,
          }),
        );
      }

      if (endpointStatus.status === "error") {
        throw new HttpResponse(null, { status: 500 });
      }

      return HttpResponse.json(
        generatePaginatedResponse<Feature>({
          data: features,
          offset: 0,
          limit: 20,
        }),
      );
    },
  ),
];
