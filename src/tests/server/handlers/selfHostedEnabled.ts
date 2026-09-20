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

      if (endpointStatus.status === "error") {
        return new HttpResponse(null, { status: 500 });
      }

      if (endpointStatus.status === "variant") {
        return HttpResponse.json(endpointStatus.response);
      }
    }

    return HttpResponse.json(selfHostedEnabledState);
  }),
];
