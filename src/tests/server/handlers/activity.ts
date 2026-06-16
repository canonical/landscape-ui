import { API_URL, API_URL_OLD } from "@/constants";
import type { Activity } from "@/features/activities";
import type { ExportJob } from "@/features/exports";
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

  http.post(`${API_URL}activities/exports`, async ({ request }) => {
    if (shouldApplyEndpointStatus("activities/exports")) {
      const { status } = getEndpointStatus();
      if (status === "error") return createEndpointStatusError();
    }
    const body = (await request.json()) as Record<string, unknown>;
    const job: ExportJob = {
      id: "act-job-new",
      name: typeof body.name === "string" ? body.name : "New activities export",
      filename: "activities-export.tsv",
      rowCount: 0,
      type: "activity",
      attributeLabels: [],
      selectedFieldIds: Array.isArray(body.selected_field_ids)
        ? (body.selected_field_ids as string[])
        : [],
      createdAt: new Date().toISOString(),
      status: "processing",
      progress: 0,
      downloadReady: false,
      query: typeof body.query === "string" ? body.query : null,
      displayQuery:
        typeof body.display_query === "string"
          ? body.display_query || null
          : null,
      hasSelection: body.has_selection === true,
    };
    return HttpResponse.json(job, { status: 201 });
  }),

  http.get(`${API_URL}activities/exports`, ({ request }) => {
    if (shouldApplyEndpointStatus("activities/exports")) {
      const { status, response } = getEndpointStatus();
      if (status === "error") {
        return createEndpointStatusNetworkError();
      }
      if (status === "empty") {
        return HttpResponse.json({ count: 0, results: [] });
      }
      if (status === "variant" && Array.isArray(response)) {
        const jobs = response as ExportJob[];
        const url = new URL(request.url);
        const search = url.searchParams.get("search") ?? "";
        const limit = parseInt(url.searchParams.get("limit") ?? "50", 10);
        const offset = parseInt(url.searchParams.get("offset") ?? "0", 10);
        const filtered = search
          ? jobs.filter((job) =>
              job.name.toLowerCase().includes(search.toLowerCase()),
            )
          : jobs;
        return HttpResponse.json({
          count: filtered.length,
          results: filtered.slice(offset, offset + limit),
        });
      }
    }
    return HttpResponse.json({ count: 0, results: [] });
  }),

  http.post(`${API_URL}activities/exports/:jobId/cancel`, () => {
    if (shouldApplyEndpointStatus("activities/exports/:jobId/cancel")) {
      const { status } = getEndpointStatus();
      if (status === "error") return createEndpointStatusError();
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(`${API_URL}activities/exports/:jobId`, () => {
    if (shouldApplyEndpointStatus("activities/exports/:jobId")) {
      const { status } = getEndpointStatus();
      if (status === "error") return createEndpointStatusError();
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_URL}activities/exports/:jobId/download`, () => {
    if (shouldApplyEndpointStatus("activities/exports/:jobId/download")) {
      const { status } = getEndpointStatus();
      if (status === "error") return createEndpointStatusNetworkError();
    }
    return new HttpResponse(
      "id\ttype\nsummary\nstatus\n1\tscript\ntest\nsucceeded",
      {
        headers: { "Content-Type": "text/tab-separated-values" },
      },
    );
  }),
];
