import { API_URL } from "@/constants";
import { EventLog, GetEventsLogParams } from "@/features/events-log";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { eventsLog } from "@/tests/mocks/eventsLog";
import { generatePaginatedResponse } from "@/tests/server/handlers/_helpers";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { http, HttpResponse } from "msw";

export default [
  http.get<never, GetEventsLogParams, ApiPaginatedResponse<EventLog>>(
    `${API_URL}events`,
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
        generatePaginatedResponse<EventLog>({
          data: endpointStatus === "default" ? eventsLog : [],
          limit,
          offset,
          search,
          searchFields: ["message"],
        }),
      );
    },
  ),
];
