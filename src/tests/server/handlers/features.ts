import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { features } from "@/tests/mocks/features";
import { getEndpointStatus } from "@/tests/controllers/controller";
import type { Feature } from "@/types/Feature";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import { createEndpointStatusNetworkError } from "./_constants";

const matchesFeaturesPath = (endpointPath?: string) =>
  !endpointPath || endpointPath.includes("features");

export default [
  http.get(`${API_URL}features`, () => {
    const endpointStatus = getEndpointStatus();

    if (
      endpointStatus.status === "empty" &&
      matchesFeaturesPath(endpointStatus.path)
    ) {
      return HttpResponse.json(
        generatePaginatedResponse<Feature>({
          data: [],
          offset: 0,
          limit: 20,
        }),
      );
    }

    if (
      endpointStatus.status === "error" &&
      matchesFeaturesPath(endpointStatus.path)
    ) {
      throw createEndpointStatusNetworkError();
    }

    return HttpResponse.json(
      generatePaginatedResponse<Feature>({
        data: features,
        offset: 0,
        limit: 20,
      }),
    );
  }),
];
