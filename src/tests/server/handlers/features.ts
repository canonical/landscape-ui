import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { features } from "@/tests/mocks/features";
import { getEndpointStatus } from "@/tests/controllers/controller";
import type { Feature } from "@/types/Feature";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import { createEndpointStatusNetworkError } from "./_constants";

const matchesFeaturesPath = (endpointPath?: string) =>
  !endpointPath || endpointPath.includes("features");

// The reports side panel ships on by default in production, so the MSW mock
// always reports `instance-reports` as enabled — even when the features
// endpoint is otherwise emptied — so "View report" is available whenever
// developing or testing against MSW. To test the disabled state, override the
// features endpoint with `server.use(...)` returning the feature as disabled.
const alwaysEnabledFeatures = features.filter(
  (feature) => feature.key === "instance-reports",
);

export default [
  http.get(`${API_URL}features`, () => {
    const endpointStatus = getEndpointStatus();

    if (
      endpointStatus.status === "empty" &&
      matchesFeaturesPath(endpointStatus.path)
    ) {
      return HttpResponse.json(
        generatePaginatedResponse<Feature>({
          data: alwaysEnabledFeatures,
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
