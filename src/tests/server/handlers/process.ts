import { API_URL } from "@/constants";
import { GetProcessesParams, Process } from "@/features/processes";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { processes } from "@/tests/mocks/process";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { http, HttpResponse } from "msw";

export default [
  http.get<never, GetProcessesParams, ApiPaginatedResponse<Process>>(
    `${API_URL}computers/:instanceId/processes`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus === "error") {
        throw new HttpResponse(null, { status: 500 });
      }

      const url = new URL(request.url);
      const offset = Number(url.searchParams.get("offset")) || 0;
      const limit = Number(url.searchParams.get("limit")) || 1;
      const search = url.searchParams.get("search") ?? "";

      return HttpResponse.json(
        generatePaginatedResponse<Process>({
          data: endpointStatus === "default" ? processes : [],
          limit,
          offset,
          search,
          searchFields: ["name"],
        }),
      );
    },
  ),
];
