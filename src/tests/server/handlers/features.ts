import { http, HttpResponse } from "msw";
import { API_URL, API_URL_DEB_ARCHIVE } from "@/constants";
import { debarchiveFeatures, features } from "@/tests/mocks/features";
import { getEndpointStatus } from "@/tests/controllers/controller";
import type { Feature } from "@/types/Feature";
import {
  generatePaginatedResponse,
  shouldApplyEndpointStatus,
} from "@/tests/server/handlers/_helpers";
import { createEndpointStatusNetworkError } from "./_constants";

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
    if (shouldApplyEndpointStatus("features")) {
      const { status } = getEndpointStatus();

      if (status === "empty") {
        return HttpResponse.json(
          generatePaginatedResponse<Feature>({
            data: alwaysEnabledFeatures,
            offset: 0,
            limit: 20,
          }),
        );
      }

      if (status === "error") {
        throw createEndpointStatusNetworkError();
      }
    }

    return HttpResponse.json(
      generatePaginatedResponse<Feature>({
        data: features,
        offset: 0,
        limit: 20,
      }),
    );
  }),

  http.get(`${API_URL_DEB_ARCHIVE}features`, () => {
    if (shouldApplyEndpointStatus("debarchive/features")) {
      const { status } = getEndpointStatus();

      if (status === "empty") {
        return HttpResponse.json(
          generatePaginatedResponse<Feature>({
            data: [],
            offset: 0,
            limit: 20,
          }),
        );
      }

      if (status === "error") {
        throw createEndpointStatusNetworkError();
      }
    }

    return HttpResponse.json(
      generatePaginatedResponse<Feature>({
        data: debarchiveFeatures,
        offset: 0,
        limit: 20,
      }),
    );
  }),
];
