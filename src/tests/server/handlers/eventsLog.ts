import { API_URL, COMMON_NUMBERS } from "@/constants";
import type { EventLog, GetEventsLogParams } from "@/features/events-log";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { eventsLog } from "@/tests/mocks/eventsLog";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { http, HttpResponse } from "msw";

export default [
  http.get<never, GetEventsLogParams, ApiPaginatedResponse<EventLog>>(
    `${API_URL}events`,
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
        generatePaginatedResponse<EventLog>({
          data: endpointStatus.status === "default" ? eventsLog : [],
          limit,
          offset,
          search,
          searchFields: ["message"],
        }),
      );
    },
  ),
];
