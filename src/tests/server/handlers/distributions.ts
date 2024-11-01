import { API_URL_OLD } from "@/constants";
import { Distribution, GetDistributionsParams } from "@/features/mirrors";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { distributions } from "@/tests/mocks/distributions";
import { http, HttpResponse } from "msw";

export default [
  http.get<never, GetDistributionsParams, Distribution[]>(
    `${API_URL_OLD}GetDistributions`,
    async () => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus === "error") {
        throw new HttpResponse(null, { status: 500 });
      }

      if (endpointStatus === "empty") {
        return HttpResponse.json([]);
      }

      return HttpResponse.json(distributions);
    },
  ),
];
