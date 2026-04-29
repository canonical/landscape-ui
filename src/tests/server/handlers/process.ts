import { API_URL } from "@/constants";
import type { Activity } from "@/features/activities";
import type { GetProcessesParams, Process } from "@/features/processes";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { activities } from "@/tests/mocks/activity";
import { processes } from "@/tests/mocks/process";
import {
  generatePaginatedResponse,
  shouldApplyEndpointStatus,
} from "@/tests/server/handlers/_helpers";
import {
  createEndpointStatusError,
  createEndpointStatusNetworkError,
} from "./_constants";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { http, HttpResponse } from "msw";

export default [
  http.get<never, GetProcessesParams, ApiPaginatedResponse<Process>>(
    `${API_URL}computers/:instanceId/processes`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();

      if (
        shouldApplyEndpointStatus("computers/:instanceId/processes") &&
        endpointStatus.status === "error"
      ) {
        throw createEndpointStatusNetworkError();
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
      if (shouldApplyEndpointStatus("processes/terminate")) {
        const { status } = getEndpointStatus();
        if (status === "error") {
          throw createEndpointStatusError();
        }
      }

      return HttpResponse.json(activities[0]);
    },
  ),
  http.post<never, never, Activity>(`${API_URL}processes/kill`, async () => {
    if (shouldApplyEndpointStatus("processes/kill")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusError();
      }
    }

    return HttpResponse.json(activities[0]);
  }),
];
