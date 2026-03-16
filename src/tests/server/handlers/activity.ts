import { API_URL, API_URL_OLD } from "@/constants";
import type { Activity, GetActivitiesParams } from "@/features/activities";
import { getEndpointStatus } from "@/tests/controllers/controller";
import {
  activities,
  activityTypes,
  INVALID_ACTIVITY_SEARCH_QUERY,
} from "@/tests/mocks/activity";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import { http, HttpResponse } from "msw";
import { ENDPOINT_STATUS_API_ERROR } from "./_constants";
import { generatePaginatedResponse, isAction } from "./_helpers";

const STATUS_QUERY_REGEX = /(?:^|\s)status:([^\s]+)/;
const TYPE_QUERY_REGEX = /(?:^|\s)type:([^\s]+)/;

const parseActivitiesQuery = (
  rawQuery: string,
): { status?: string; type?: string; searchQuery: string } => {
  const statusMatch = rawQuery.match(STATUS_QUERY_REGEX);
  const typeMatch = rawQuery.match(TYPE_QUERY_REGEX);

  let searchQuery = rawQuery;

  if (statusMatch) {
    searchQuery = searchQuery.replace(statusMatch[0], "").trim();
  }

  if (typeMatch) {
    searchQuery = searchQuery.replace(typeMatch[0], "").trim();
  }

  if (!statusMatch && !typeMatch) {
    return { searchQuery };
  }

  return {
    status: statusMatch?.[1],
    type: typeMatch?.[1],
    searchQuery,
  };
};

export default [
  http.get<never, GetActivitiesParams, ApiPaginatedResponse<Activity>>(
    `${API_URL}activities`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw ENDPOINT_STATUS_API_ERROR;
      }

      const url = new URL(request.url);
      const offset = Number(url.searchParams.get("offset")) || 0;
      const limit = Number(url.searchParams.get("limit")) || 1;
      const query = url.searchParams.get("query") ?? "";

      if (query === INVALID_ACTIVITY_SEARCH_QUERY) {
        throw HttpResponse.json(
          {
            error: "InvalidQueryError",
            message: "The search query provided is invalid.",
          },
          { status: 400 },
        );
      }

      const { status, type, searchQuery } = parseActivitiesQuery(query);
      const filteredActivities = activities.filter((activity) => {
        if (status && activity.activity_status !== status) {
          return false;
        }

        if (type && activity.type !== type) {
          return false;
        }

        return true;
      });

      return HttpResponse.json(
        generatePaginatedResponse<Activity>({
          data: filteredActivities,
          limit,
          offset,
          search: searchQuery,
          searchFields: ["summary"],
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

  http.get<never, never, readonly string[]>(
    API_URL_OLD,
    async ({ request }) => {
      if (!isAction(request, "GetActivityTypes")) {
        return;
      }

      return HttpResponse.json(activityTypes);
    },
  ),

  http.get<never, never, number[]>(API_URL_OLD, async ({ request }) => {
    if (!isAction(request, "CancelActivities")) {
      return;
    }

    return HttpResponse.json([activities[0].id, activities[1].id]);
  }),

  http.get<never, never, string[]>(API_URL_OLD, async ({ request }) => {
    if (!isAction(request, "ApproveActivities")) {
      return;
    }

    return HttpResponse.json([
      String(activities[0].id),
      String(activities[1].id),
    ]);
  }),

  http.post<never, { activity_ids: number[] }, number[]>(
    `${API_URL}activities/revert`,
    async () => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw ENDPOINT_STATUS_API_ERROR;
      }

      return HttpResponse.json([activities[0].id, activities[1].id]);
    },
  ),

  http.post<never, { activity_ids: number[] }, number[]>(
    `${API_URL}activities/reapply`,
    async () => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw ENDPOINT_STATUS_API_ERROR;
      }

      return HttpResponse.json([activities[0].id, activities[1].id]);
    },
  ),
];
