import { API_URL_OLD } from "@/constants";
import type { Distribution, GetDistributionsParams } from "@/features/mirrors";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { distributions } from "@/tests/mocks/distributions";
import { http, HttpResponse } from "msw";
import { isAction } from "@/tests/server/handlers/_helpers";

export default [
  http.get<never, GetDistributionsParams, Distribution[]>(
    API_URL_OLD,
    async ({ request }) => {
      if (!isAction(request, "GetDistributions")) {
        return;
      }

      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw new HttpResponse(null, { status: 500 });
      }

      if (endpointStatus.status === "empty") {
        return HttpResponse.json([]);
      }

      return HttpResponse.json(distributions);
    },
  ),
];
