import { API_URL, API_URL_OLD, COMMON_NUMBERS } from "@/constants";
import { getEndpointStatus } from "@/tests/controllers/controller";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { http, HttpResponse } from "msw";
import { generatePaginatedResponse, isAction } from "./_helpers";
import type { Activity, GetActivitiesParams } from "@/features/activities";
import { activities, activityTypes } from "@/tests/mocks/activity";

export default [
  http.get<never, GetActivitiesParams, ApiPaginatedResponse<Activity>>(
    `${API_URL}activities`,
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
        generatePaginatedResponse<Activity>({
          data: activities,
          limit,
          offset,
          search,
          searchFields: ["name"],
        }),
      );
    },
  ),

  http.get<never, never, string[]>(API_URL_OLD, async ({ request }) => {
    if (!isAction(request, "GetActivityTypes")) {
      return;
    }

    return HttpResponse.json(activityTypes);
  }),
];
