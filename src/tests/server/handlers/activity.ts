import { API_URL, API_URL_OLD } from "@/constants";
import type { Activity, GetActivitiesParams } from "@/features/activities";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { activities, activityTypes } from "@/tests/mocks/activity";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { http, HttpResponse } from "msw";
import { generatePaginatedResponse, isAction } from "./_helpers";

export default [
  http.get<never, GetActivitiesParams, ApiPaginatedResponse<Activity>>(
    `${API_URL}activities`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw new HttpResponse(null, { status: 500 });
      }

      const url = new URL(request.url);
      const offset = Number(url.searchParams.get("offset")) || 0;
      const limit = Number(url.searchParams.get("limit")) || 1;
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

  http.get<{ id: string }, GetActivitiesParams, Activity>(
    `${API_URL}activities/:id`,
    async ({ params: { id } }) => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw new HttpResponse(null, { status: 500 });
      }

      return HttpResponse.json<Activity>(
        activities.find((activity) => activity.id === parseInt(id)) ?? {
          activity_status: "succeeded",
          approval_time: null,
          children: [],
          completion_time: null,
          computer_id: 0,
          creation_time: "",
          creator: undefined,
          deliver_after_time: null,
          deliver_before_time: null,
          delivery_time: null,
          id: 0,
          modification_time: "",
          parent_id: null,
          result_code: null,
          result_text: null,
          schedule_after_time: null,
          schedule_before_time: null,
          summary: "",
          type: "",
        },
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
