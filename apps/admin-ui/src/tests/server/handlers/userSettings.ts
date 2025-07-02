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
];
