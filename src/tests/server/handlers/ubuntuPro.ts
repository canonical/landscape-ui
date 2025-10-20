import { getEndpointStatus } from "@/tests/controllers/controller";
import { http, HttpResponse } from "msw";
import { ENDPOINT_STATUS_API_ERROR } from "./_constants";
import { API_URL } from "@/constants";
import {
  attachUbuntuProActivity,
  detachUbuntuProActivity,
} from "@/tests/mocks/ubuntuPro";

export default [
  http.post(`${API_URL}attach-token`, () => {
    const endpointStatus = getEndpointStatus();

    if (
      !endpointStatus.path ||
      (endpointStatus.path && endpointStatus.path.includes("attach-token"))
    ) {
      if (endpointStatus.status === "error") {
        throw ENDPOINT_STATUS_API_ERROR;
      }
    }

    return HttpResponse.json(attachUbuntuProActivity);
  }),

  http.post(`${API_URL}detach-token`, () => {
    const endpointStatus = getEndpointStatus();

    if (
      !endpointStatus.path ||
      (endpointStatus.path && endpointStatus.path.includes("detach-token"))
    ) {
      if (endpointStatus.status === "error") {
        throw ENDPOINT_STATUS_API_ERROR;
      }
    }

    return HttpResponse.json(detachUbuntuProActivity);
  }),
];
