import { http, HttpResponse } from "msw";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { API_URL } from "@/constants";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import { Process } from "@/types/Process";
import { GetProcessesParams } from "@/hooks/useProcesses";
import { processes } from "@/tests/mocks/process";
import { getEndpointStatus } from "@/tests/controllers/controller";

export default [
  // @ts-ignore-next-line
  http.get<GetProcessesParams, never, ApiPaginatedResponse<Process>>(
    `${API_URL}computers/:instanceId/processes`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus === "error") {
        throw new HttpResponse(null, { status: 500 });
      }

      const url = new URL(request.url);
      const offset = Number(url.searchParams.get("offset")) ?? 0;
      const limit = Number(url.searchParams.get("limit")) ?? 1;
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
