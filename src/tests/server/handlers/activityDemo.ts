import { API_URL, API_URL_OLD } from "@/constants";
import type { ActivityCommon, ActivityStatus } from "@/features/activities";
import type { UserActivityEvent } from "@/features/users";
import {
  activityDemoChildren,
  activityDemoGroups,
  activityDemoUsers,
} from "@/tests/mocks/activityDemo";
import { scriptProfiles } from "@/tests/mocks/scriptProfiles";
import { delay, http, HttpResponse } from "msw";
import { parseActivitiesQuery } from "./activity";
import { generatePaginatedResponse, isAction } from "./_helpers";

export type ActivityDemoScenario = "default" | "empty" | "loading" | "error";

export const filterDemoActivities = <T extends ActivityCommon>(
  data: T[],
  query: string,
): T[] => {
  const { status, type, computerId, createdAfter, createdBefore, searchQuery } =
    parseActivitiesQuery(query);
  const ids = [...searchQuery.matchAll(/(?:^| OR )id:(\d+)/g)].map((match) =>
    Number(match[1]),
  );
  const parentId = /(?:^|\s)parent-id:(\d+)/.exec(searchQuery)?.[1];
  const creator = /(?:^|\s)creator:([^\s]+)/.exec(searchQuery)?.[1];
  return data.filter((activity) => {
    const created = Date.parse(activity.creation_time);
    return (
      (!status || activity.activity_status === status) &&
      (!type || activity.type === type) &&
      (!computerId || activity.computer_id === Number(computerId)) &&
      (!parentId || activity.parent_id === Number(parentId)) &&
      (!ids.length || ids.includes(activity.id)) &&
      (!creator || activity.creator?.email === creator) &&
      (createdAfter === undefined || created > createdAfter) &&
      (createdBefore === undefined || created < createdBefore)
    );
  });
};

export const createActivityDemoHandlers = (
  getScenario: () => ActivityDemoScenario = () => "default",
) => {
  const children = structuredClone(activityDemoChildren);
  const groups = structuredClone(activityDemoGroups);
  const [firstGroup, secondGroup, thirdGroup] = groups;
  const [firstChild] = children;
  if (!firstGroup || !secondGroup || !firstChild)
    throw new Error("Activity demo requires two groups and a child");

  const list = <T extends ActivityCommon>(data: T[], request: Request) => {
    const params = new URL(request.url).searchParams;
    const query = params.get("query") ?? "";
    const { searchQuery } = parseActivitiesQuery(query);
    if (
      searchQuery
        .replace(/(?:parent-id|id):\d+|creator:[^\s]+|\bOR\b/g, "")
        .trim()
    ) {
      return HttpResponse.json(
        {
          error: "InvalidQueryError",
          message:
            "Use structured activity search terms, such as id:10000 or computer:id:1.",
        },
        { status: 400 },
      );
    }
    return HttpResponse.json(
      generatePaginatedResponse({
        data:
          getScenario() === "empty" ? [] : filterDemoActivities(data, query),
        limit: Number(params.get("limit") ?? "20"),
        offset: Number(params.get("offset") ?? "0"),
      }),
    );
  };

  const changeStatus = (request: Request, status: ActivityStatus) => {
    const params = new URL(request.url).searchParams;
    const ids = [...params.entries()]
      .filter(([key]) => key === "activity_ids" || key === "activity_ids[]")
      .flatMap(([, value]) => value.split(",").map(Number));
    let selected: typeof children = [];
    const query = params.get("query");
    if (query !== null) {
      selected = filterDemoActivities(children, query);
    }
    if (ids.length) selected = children.filter(({ id }) => ids.includes(id));
    selected.forEach((activity) => {
      activity.activity_status = status;
      activity.actions = {
        approvable: false,
        cancelable: status !== "canceled",
        reappliable: status === "canceled",
      };
    });
    return selected.map(({ id }) => id);
  };

  return [
    http.get(`${API_URL}activities*`, async () => {
      const scenario = getScenario();
      if (scenario === "loading") await delay("infinite");
      if (scenario === "error") {
        return HttpResponse.json(
          {
            error: "InternalServerError",
            message:
              "Demo activity request failed. Set the activity scenario to default and reload.",
          },
          { status: 500 },
        );
      }
      return;
    }),
    http.get(`${API_URL}activities`, ({ request }) => list(children, request)),
    http.get(`${API_URL}activities/parents`, ({ request }) =>
      list(groups, request),
    ),
    http.get(`${API_URL}activities/:id`, ({ params }) => {
      const activity = [...groups, ...children].find(
        ({ id }) => id === Number(params.id),
      );
      return activity
        ? HttpResponse.json({
            ...activity,
            ...(activity.type === "ActivityGroup"
              ? {
                  children: children.filter(
                    ({ parent_id }) => parent_id === activity.id,
                  ),
                }
              : {}),
          })
        : HttpResponse.json(
            { error: "NotFound", message: "Unknown demo activity" },
            { status: 404 },
          );
    }),
    http.get(API_URL_OLD, ({ request }) => {
      if (isAction(request, "GetActivityTypes")) {
        return HttpResponse.json([
          ...new Set(children.map(({ type }) => type)),
        ]);
      }
      if (isAction(request, "ApproveActivities")) {
        return HttpResponse.json(
          changeStatus(request, "undelivered").map(String),
        );
      }
      if (isAction(request, "CancelActivities")) {
        return HttpResponse.json(changeStatus(request, "canceled"));
      }
      return;
    }),
    http.post<never, { activity_ids: number[] }>(
      `${API_URL}activities/reapply`,
      async ({ request }) => {
        const { activity_ids } = await request.json();
        children
          .filter(({ id }) => activity_ids.includes(id))
          .forEach((activity) => {
            activity.activity_status = "undelivered";
            activity.completion_time = null;
            activity.result_text = null;
            activity.actions = {
              approvable: false,
              cancelable: true,
              reappliable: false,
            };
          });
        return HttpResponse.json(activity_ids);
      },
    ),
    http.get(`${API_URL}users`, () =>
      HttpResponse.json(
        generatePaginatedResponse({
          data: activityDemoUsers,
          limit: activityDemoUsers.length,
          offset: 0,
        }),
      ),
    ),
    http.get(
      `${API_URL}computers/:computerId/users/:username/pending-activities`,
      () => {
        const event: UserActivityEvent = {
          activity_id: firstChild.id,
          activity_status: firstChild.activity_status,
          summary: firstChild.summary,
          creation_time: firstChild.creation_time,
          completion_time: firstChild.completion_time,
          changes: [
            { kind: "profile", field: "name" },
            { kind: "profile", field: "location" },
            { kind: "additional_group", group_name: "sudo", operation: "add" },
          ],
        };
        return HttpResponse.json({ count: 1, results: [event] });
      },
    ),
    http.post(`${API_URL}users\\:edit`, () => HttpResponse.json(firstGroup)),
    http.post(`${API_URL}users`, () => HttpResponse.json(firstGroup)),
    http.delete(`${API_URL}users`, () => HttpResponse.json(firstGroup)),
    http.post(`${API_URL}users/lock`, () => HttpResponse.json(firstGroup)),
    http.post(`${API_URL}users/unlock`, () => HttpResponse.json(secondGroup)),
    http.post<never, { action: string }>(
      `${API_URL}computers/:computerId/usergroups/update_bulk`,
      async ({ request }) => {
        const { action } = await request.json();
        return HttpResponse.json(action === "add" ? secondGroup : thirdGroup);
      },
    ),
    http.get(`${API_URL}script-profiles`, ({ request }) => {
      const params = new URL(request.url).searchParams;
      const data = scriptProfiles
        .map((profile) => ({
          ...profile,
          activities: { last_activity: firstGroup },
        }))
        .filter(({ archived }) => {
          const status = params.get("archived") ?? "active";
          return status === "all" || archived === (status === "archived");
        });
      return HttpResponse.json(
        generatePaginatedResponse({
          data,
          limit: Number(params.get("limit") ?? "20"),
          offset: Number(params.get("offset") ?? "0"),
          search: params.get("search") ?? "",
          searchFields: ["title"],
        }),
      );
    }),
    http.get(`${API_URL}script-profiles/:id/activities`, ({ request }) =>
      list(groups, request),
    ),
    http.get(`${API_URL}script-profiles/:id`, ({ params }) => {
      const profile = scriptProfiles.find(({ id }) => id === Number(params.id));
      return profile
        ? HttpResponse.json({
            ...profile,
            activities: { last_activity: firstGroup },
          })
        : new HttpResponse(null, { status: 404 });
    }),
    http.post(`${API_URL}usg-profiles/:id\\:execute`, () =>
      HttpResponse.json(firstGroup),
    ),
  ];
};
