import { API_URL } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { http, HttpResponse } from "msw";
import { shouldApplyEndpointStatus } from "./_helpers";

export default [
  http.post(`${API_URL}person`, async () => {
    if (shouldApplyEndpointStatus("person")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
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
    }
    return HttpResponse.json({});
  }),

  http.put(`${API_URL}password`, async () => {
    if (shouldApplyEndpointStatus("password")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        return HttpResponse.json(
          {
            error: "InternalServerError",
            message: "Error response",
          },
          { status: 500 },
        );
      }
    }
    return HttpResponse.json({});
  }),
];
