import { getEndpointStatus } from "@/tests/controllers/controller";
import { http, HttpResponse } from "msw";
import { createEndpointStatusError } from "./_constants";
import { shouldApplyEndpointStatus } from "./_helpers";
import { API_URL } from "@/constants";
import {
  attachUbuntuProActivity,
  detachUbuntuProActivity,
} from "@/tests/mocks/ubuntuPro";

export default [
  http.post(`${API_URL}attach-token`, () => {
    const endpointStatus = getEndpointStatus();

    if (shouldApplyEndpointStatus("attach-token")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusError();
      }
    }
    if (
      endpointStatus.status === "variant" &&
      endpointStatus.path === "attach-token"
    ) {
      return HttpResponse.json(endpointStatus.response);
    }

    return HttpResponse.json(attachUbuntuProActivity);
  }),

  http.post(`${API_URL}detach-token`, () => {
    if (shouldApplyEndpointStatus("detach-token")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusError();
      }
    }

    return HttpResponse.json(detachUbuntuProActivity);
  }),
];
