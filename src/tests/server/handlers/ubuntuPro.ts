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

    if (endpointStatus.status === "error") {
      throw ENDPOINT_STATUS_API_ERROR;
    }

    if (endpointStatus.status === "variant" && endpointStatus.path === "attach-token") {
      return HttpResponse.json(endpointStatus.response);
    }

    return HttpResponse.json(attachUbuntuProActivity);
  }),

  http.post(`${API_URL}detach-token`, () => {
    const endpointStatus = getEndpointStatus();

    if (endpointStatus.status === "error") {
      throw ENDPOINT_STATUS_API_ERROR;
    }

    return HttpResponse.json(detachUbuntuProActivity);
  }),
];
