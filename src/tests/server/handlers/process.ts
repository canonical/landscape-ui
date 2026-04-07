import { API_URL } from "@/constants";
import type { Activity } from "@/features/activities";
import type { GetProcessesParams, Process } from "@/features/processes";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { activities } from "@/tests/mocks/activity";
import { processes } from "@/tests/mocks/process";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { http, HttpResponse } from "msw";
import { getEndpointStatusApiError } from "./_constants";

export default [
  http.get<never, GetProcessesParams, ApiPaginatedResponse<Process>>(
    `${API_URL}computers/:instanceId/processes`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw getEndpointStatusApiError();
      }

      const url = new URL(request.url);
      const offset = Number(url.searchParams.get("offset")) || 0;
      const limit = Number(url.searchParams.get("limit")) || 1;
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
  http.post<never, never, Activity>(
    `${API_URL}processes/terminate`,
    async () => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw getEndpointStatusApiError();
      }

      return HttpResponse.json(activities[0]);
    },
  ),
  http.post<never, never, Activity>(`${API_URL}processes/kill`, async () => {
    const endpointStatus = getEndpointStatus();

    if (endpointStatus.status === "error") {
      throw getEndpointStatusApiError();
    }

    return HttpResponse.json(activities[0]);
  }),
];
