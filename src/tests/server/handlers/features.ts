import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { features } from "@/tests/mocks/features";
import { getEndpointStatus } from "@/tests/controllers/controller";
import type { Feature } from "@/types/Feature";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import { createEndpointStatusNetworkError } from "./_constants";

const matchesFeaturesPath = (endpointPath?: string) =>
  !endpointPath || endpointPath.includes("features");

// Keep `instance-reports` present even when the features endpoint is mocked as
// empty, so tests/dev scenarios that rely on `useAuth().isFeatureEnabled(...)`
// can still opt into report-related UI when using MSW.
//
// To test a disabled state under MSW, override the features endpoint with
// `server.use(...)` and return the feature as disabled.
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
