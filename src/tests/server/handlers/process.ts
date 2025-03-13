import { API_URL, COMMON_NUMBERS } from "@/constants";
import type { GetProcessesParams, Process } from "@/features/processes";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { processes } from "@/tests/mocks/process";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { http, HttpResponse } from "msw";

export default [
  http.get<never, GetProcessesParams, ApiPaginatedResponse<Process>>(
    `${API_URL}computers/:instanceId/processes`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw new HttpResponse(null, { status: 500 });
      }

      const url = new URL(request.url);
      const offset =
        Number(url.searchParams.get("offset")) || COMMON_NUMBERS.ZERO;
      const limit = Number(url.searchParams.get("limit")) || COMMON_NUMBERS.ONE;
      const search = url.searchParams.get("search") ?? "";

      return HttpResponse.json(
        generatePaginatedResponse<Process>({
          data: endpointStatus.status === "default" ? processes : [],
          limit,
          offset,
          search,
          searchFields: ["name"],
        }),
      );
    },
  ),
];
