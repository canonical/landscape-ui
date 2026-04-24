import { API_URL } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { http, HttpResponse } from "msw";

export default [
  http.post(`${API_URL}person`, async () => {
    const endpointStatus = getEndpointStatus();
    if (endpointStatus.status === "error") {
      return HttpResponse.json(
        {
          error: "InternalServerError",
          message: "Error response",
        },
        {
          status: 500,
        },
      );
    }
    return HttpResponse.json({});
  }),

  http.put(`${API_URL}password`, async () => {
    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "password")
    ) {
      return HttpResponse.json(
        {
          error: "InternalServerError",
          message: "Error response",
        },
        { status: 500 },
      );
    }
    return HttpResponse.json({});
  }),
];
