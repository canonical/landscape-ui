import { delay, http, HttpResponse } from "msw";
import { API_URL, API_URL_DEB_ARCHIVE } from "@/constants";
import { debarchiveFeatures, features } from "@/tests/mocks/features";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { shouldApplyEndpointStatus } from "@/tests/server/handlers/_helpers";
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
      const { status, response } = getEndpointStatus("features");

      if (status === "empty") {
        return HttpResponse.json({ results: alwaysEnabledFeatures });
      }

      if (status === "error") {
        throw createEndpointStatusNetworkError();
      }

      if (status === "variant") {
        return HttpResponse.json(response);
      }
    }

    return HttpResponse.json({ results: features });
  }),

  http.get(`${API_URL_DEB_ARCHIVE}features`, async () => {
    if (shouldApplyEndpointStatus("debarchive/features")) {
      const { status } = getEndpointStatus();

      if (status === "empty") {
        return HttpResponse.json({ features: [], nextPageToken: "" });
      }

      if (status === "error") {
        throw createEndpointStatusNetworkError();
      }

      if (status === "loading") {
        await delay("infinite");
      }
    }

    return HttpResponse.json({
      features: debarchiveFeatures,
      nextPageToken: "",
    });
  }),
];
