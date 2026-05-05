import { API_URL, API_URL_OLD } from "@/constants";
import type { Activity } from "@/features/activities";
import { getEndpointStatus } from "@/tests/controllers/controller";
import {
  activities,
  activityTypes,
  INVALID_ACTIVITY_SEARCH_QUERY,
  manyDeliveredActivities,
  manyUnapprovedActivities,
} from "@/tests/mocks/activity";
import { http, HttpResponse } from "msw";
import {
  createEndpointStatusError,
  createEndpointStatusNetworkError,
} from "./_constants";
import {
  generatePaginatedResponse,
  isAction,
  shouldApplyEndpointStatus,
} from "./_helpers";

const STATUS_QUERY_REGEX = /(?:^|\s)status:([^\s]+)/;
const TYPE_QUERY_REGEX = /(?:^|\s)type:([^\s]+)/;
const COMPUTER_ID_REGEX = /computer:id:(\d+)/;

const parseActivitiesQuery = (
  rawQuery: string,
): {
  status?: string;
  type?: string;
  computerId?: string;
  searchQuery: string;
} => {
  const statusMatch = rawQuery.match(STATUS_QUERY_REGEX);
  const typeMatch = rawQuery.match(TYPE_QUERY_REGEX);
  const computerMatch = rawQuery.match(COMPUTER_ID_REGEX);

  let searchQuery = rawQuery;

  if (statusMatch) {
    searchQuery = searchQuery.replace(statusMatch[0], "").trim();
  }
  if (typeMatch) {
    searchQuery = searchQuery.replace(typeMatch[0], "").trim();
  }
  if (computerMatch) {
    searchQuery = searchQuery.replace(computerMatch[0], "").trim();
  }

  return {
    status: statusMatch?.[1],
    type: typeMatch?.[1],
    computerId: computerMatch?.[1],
    searchQuery: searchQuery.replace(/\s\s+/g, " "),
  };
};

export default [
  http.get(`${API_URL}activities`, async ({ request }) => {
    if (shouldApplyEndpointStatus("activities")) {
      const { status } = getEndpointStatus();

      if (status === "error") {
        throw createEndpointStatusError();
      }

      if (status === "empty") {
        return HttpResponse.json({
          results: [],
          count: 0,
          next: null,
          previous: null,
        });
      }
    }

    const url = new URL(request.url);
    const offset = Number(url.searchParams.get("offset")) || 0;
    const limit = Number(url.searchParams.get("limit")) || 1;
    const query = url.searchParams.get("query") ?? "";
    const endpointStatus = getEndpointStatus();

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

    if (
      endpointStatus.status === "variant" &&
      endpointStatus.path === "activities"
    ) {
      const { unapproved, delivered } = endpointStatus.response as {
        unapproved: Activity[];
        delivered: Activity[];
      };
      const bulkData = status === "unapproved" ? unapproved : delivered;
      return HttpResponse.json(
        generatePaginatedResponse<Activity>({ data: bulkData, limit, offset }),
      );
    }

    if (endpointStatus.path === "many-activities") {
      const bulkData =
        status === "unapproved"
          ? manyUnapprovedActivities
          : manyDeliveredActivities;
      return HttpResponse.json(
        generatePaginatedResponse<Activity>({
          data: bulkData,
          limit,
          offset,
        }),
      );
    }

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
  }),

  http.get(`${API_URL}activities/:id`, async ({ params: { id } }) => {
    if (shouldApplyEndpointStatus("activities/:id")) {
      throw createEndpointStatusNetworkError();
    }

    return HttpResponse.json<Activity>(
      activities.find((activity) => activity.id === parseInt(id as string)) ?? {
        activity_status: "succeeded",
        approval_time: null,
        children: [],
        completion_time: null,
        computer_id: 0,
        creation_time: "",
        creator: { email: "", id: 0, name: "" },
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
  }),

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

    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.status === "error" &&
      (!endpointStatus.path || endpointStatus.path === "ApproveActivities")
    ) {
      throw createEndpointStatusError();
    }

    return HttpResponse.json([
      String(activities[0].id),
      String(activities[1].id),
    ]);
  }),

  http.post(`${API_URL}activities/reapply`, async () => {
    if (shouldApplyEndpointStatus("activities/reapply")) {
      throw createEndpointStatusError();
    }

    return HttpResponse.json([activities[0].id, activities[1].id]);
  }),
];
