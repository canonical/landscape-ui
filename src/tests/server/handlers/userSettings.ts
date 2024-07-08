import { API_URL } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { HttpResponse, http } from "msw";

export default [
  // @ts-ignore-next-line
  http.post(`${API_URL}person`, async () => {
    const endpointStatus = getEndpointStatus();
    if (endpointStatus === "error") {
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
