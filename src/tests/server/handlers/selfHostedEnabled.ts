import { API_URL } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { shouldApplyEndpointStatus } from "./_helpers";
import { http, HttpResponse } from "msw";

export const selfHostedEnabledState = {
  lds_enabled: true,
};

export default [
  http.get(`${API_URL}self-hosted/enabled`, () => {
    if (shouldApplyEndpointStatus("self-hosted/enabled")) {
      const endpointStatus = getEndpointStatus("self-hosted/enabled");

      if (endpointStatus.status === "variant") {
        if (
          typeof endpointStatus.response === "object" &&
          endpointStatus.response !== null &&
          "lds_enabled" in endpointStatus.response &&
          typeof endpointStatus.response.lds_enabled === "boolean"
        ) {
          return HttpResponse.json(endpointStatus.response);
        }
      }
    }

    return HttpResponse.json(selfHostedEnabledState);
  }),
];
