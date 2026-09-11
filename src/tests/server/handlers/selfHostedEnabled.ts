import { API_URL } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { shouldApplyEndpointStatus } from "./_helpers";
import { http, HttpResponse } from "msw";

export const selfHostedEnabledState = {
  enabled: true,
};

export default [
  http.get(`${API_URL}self-hosted/status`, () => {
    if (shouldApplyEndpointStatus("self-hosted/status")) {
      const endpointStatus = getEndpointStatus("self-hosted/status");

      if (endpointStatus.status === "variant") {
        if (
          typeof endpointStatus.response === "object" &&
          endpointStatus.response !== null &&
          "enabled" in endpointStatus.response &&
          typeof endpointStatus.response.enabled === "boolean"
        ) {
          return HttpResponse.json(endpointStatus.response);
        }
      }
    }

    return HttpResponse.json(selfHostedEnabledState);
  }),
];
