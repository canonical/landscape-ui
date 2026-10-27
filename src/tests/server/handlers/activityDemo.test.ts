import { API_URL, API_URL_OLD } from "@/constants";
import type { Activity, ActivityGroup } from "@/features/activities";
import type { ScriptProfile } from "@/features/script-profiles";
import type { UserActivityEvent } from "@/features/users";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { User } from "@/types/User";
import {
  activityDemoChildren,
  activityDemoGroups,
} from "@/tests/mocks/activityDemo";
import server from "@/tests/server";
import { HttpStatusCode } from "axios";
import {
  createActivityDemoHandlers,
  filterDemoActivities,
  type ActivityDemoScenario,
} from "./activityDemo";

const [group, otherGroup] = activityDemoGroups;
const [child] = activityDemoChildren;
assert(group && otherGroup && child);
const PAGE_SIZE = 20;
const PENDING_ACTIVITY_ID = 201;
const LOADING_CHECK_DELAY_MS = 20;

const get = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`);
  expect(response.status).toBe(HttpStatusCode.Ok);
  return response.json() as Promise<T>;
};
const post = async (path: string, body: unknown = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  expect(response.status).toBe(HttpStatusCode.Ok);
  return response.json() as Promise<unknown>;
};

describe("browser activity demo", () => {
  let scenario: ActivityDemoScenario = "default";
  beforeEach(() => {
    scenario = "default";
    server.use(...createActivityDemoHandlers(() => scenario));
  });

  it("uses populated data by default and rejects incomplete group fixtures", async () => {
    server.use(...createActivityDemoHandlers());
    expect(
      (await get<ApiPaginatedResponse<Activity>>("activities")).count,
    ).toBe(activityDemoChildren.length);
    const saved = activityDemoGroups.splice(0);
    try {
      expect(() => createActivityDemoHandlers()).toThrow(
        "Activity demo requires two groups",
      );
    } finally {
      activityDemoGroups.push(...saved);
    }
    const extraGroups = activityDemoGroups.splice(1);
    try {
      expect(() => createActivityDemoHandlers()).toThrow(
        "Activity demo requires two groups",
      );
    } finally {
      activityDemoGroups.push(...extraGroups);
    }
    const savedChildren = activityDemoChildren.splice(0);
    try {
      expect(() => createActivityDemoHandlers()).toThrow(
        "Activity demo requires two groups and a child",
      );
    } finally {
      activityDemoChildren.push(...savedChildren);
    }
    const legacy = new URL(API_URL_OLD, location.origin);
    legacy.searchParams.set("action", "GetPendingComputers");
    expect((await fetch(legacy)).status).toBe(HttpStatusCode.Ok);
  });

  it("has every activity status, valid relationships, action states, optional output and metadata", () => {
    const statuses = new Set(
      activityDemoChildren.map(({ activity_status }) => activity_status),
    );
    expect(statuses).toEqual(
      new Set([
        "unapproved",
        "delivered",
        "succeeded",
        "failed",
        "scheduled",
        "waiting",
        "undelivered",
        "blocked",
        "canceled",
      ]),
    );
    expect(activityDemoGroups.length).toBeGreaterThan(PAGE_SIZE);
    expect(
      activityDemoChildren.filter(
        ({ activity_status }) => activity_status === "unapproved",
      ).length,
    ).toBeGreaterThan(PAGE_SIZE);
    expect(
      activityDemoChildren.filter(
        ({ activity_status }) => activity_status === "delivered",
      ).length,
    ).toBeGreaterThan(PAGE_SIZE);
    expect(
      new Set(activityDemoChildren.map(({ computer_id }) => computer_id)).size,
    ).toBeGreaterThan(1);
    for (const activity of activityDemoChildren) {
      expect(
        activityDemoGroups.some(({ id }) => id === activity.parent_id),
      ).toBe(true);
      expect(Date.parse(activity.creation_time)).not.toBeNaN();
      expect(activity.computer_title).not.toBe("");
    }
    expect(
      activityDemoGroups.every(({ actions }) => actions === undefined),
    ).toBe(true);
    for (const output of [true, false]) {
      expect(
        activityDemoGroups.some(
          (item) =>
            !!item.result_text === output &&
            !activityDemoChildren.some(
              ({ parent_id }) => parent_id === item.id,
            ),
        ),
      ).toBe(true);
      expect(
        activityDemoChildren.some((item) => !!item.result_text === output),
      ).toBe(true);
    }
    expect(activityDemoChildren.some(({ creator }) => creator === null)).toBe(
      true,
    );
    expect(
      activityDemoChildren.some(
        ({ actions }) =>
          !actions?.approvable && !actions?.cancelable && !actions?.reappliable,
      ),
    ).toBe(true);
  });

  it.each([
    ["status:failed", (item: Activity) => item.activity_status === "failed"],
    [
      "type:ExecuteScriptRequest",
      (item: Activity) => item.type === "ExecuteScriptRequest",
    ],
    ["computer:id:1", (item: Activity) => item.computer_id === 1],
    [`parent-id:${group.id}`, (item: Activity) => item.parent_id === group.id],
    [
      `id:${child.id} OR id:201`,
      (item: Activity) => [child.id, PENDING_ACTIVITY_ID].includes(item.id),
    ],
    [
      "creator:john@example.com",
      (item: Activity) => item.creator?.email === "john@example.com",
    ],
    ["created-after:2026-10-22", () => true],
    ["created-before:2026-10-24", () => true],
    ["created-after:2026-10-24", () => false],
    ["created-before:2026-10-22", () => false],
  ])("filters %s exactly", async (query, predicate) => {
    const expected = activityDemoChildren.filter(predicate);
    const result = await get<ApiPaginatedResponse<Activity>>(
      `activities?query=${encodeURIComponent(query)}&limit=1000`,
    );
    expect(result.results).toEqual(expected);
    expect(result.count).toBe(expected.length);
  });

  it("combines filters and returns empty results for unmatched searches", () => {
    const selected = filterDemoActivities(
      activityDemoChildren,
      `parent-id:${group.id} computer:id:1 status:unapproved type:ExecuteScriptRequest created-after:2026-10-22 created-before:2026-10-24`,
    );
    expect(selected.length).toBeGreaterThan(0);
    expect(
      selected.every(
        (item) =>
          item.parent_id === group.id &&
          item.computer_id === 1 &&
          item.activity_status === "unapproved" &&
          item.type === "ExecuteScriptRequest",
      ),
    ).toBe(true);
    expect(filterDemoActivities(activityDemoChildren, "id:0")).toEqual([]);
    expect(
      filterDemoActivities(activityDemoChildren, "creator:nobody@example.com"),
    ).toEqual([]);
  });

  it("paginates children and parents independently and resolves every details ID", async () => {
    const firstPage = await get<ApiPaginatedResponse<Activity>>("activities");
    const secondPage = await get<ApiPaginatedResponse<Activity>>(
      `activities?limit=${PAGE_SIZE}&offset=${PAGE_SIZE}`,
    );
    expect(firstPage.results).toEqual(activityDemoChildren.slice(0, PAGE_SIZE));
    expect(secondPage.results).toEqual(
      activityDemoChildren.slice(PAGE_SIZE, PAGE_SIZE * 2),
    );
    expect(firstPage.count).toBe(activityDemoChildren.length);
    const parents =
      await get<ApiPaginatedResponse<ActivityGroup>>("activities/parents");
    expect(parents.count).toBe(activityDemoGroups.length);
    expect(parents.results.every(({ type }) => type === "ActivityGroup")).toBe(
      true,
    );
    const details = await get<ActivityGroup>(`activities/${group.id}`);
    expect(details.children).toEqual(
      activityDemoChildren.filter(({ parent_id }) => parent_id === group.id),
    );
    expect(await get<Activity>(`activities/${child.id}`)).toEqual(child);
    const missing = await fetch(`${API_URL}activities/0`);
    expect(missing.status).toBe(HttpStatusCode.NotFound);
    expect(await missing.json()).toMatchObject({ error: "NotFound" });
  });

  it("rejects unsupported free-text searches instead of pretending to filter", async () => {
    const response = await fetch(`${API_URL}activities?query=plain-words`);
    expect(response.status).toBe(HttpStatusCode.BadRequest);
    expect(await response.json()).toMatchObject({ error: "InvalidQueryError" });
  });

  it("supports empty and error scenarios", async () => {
    scenario = "empty";
    for (const path of ["activities", "activities/parents"]) {
      expect(await get(path)).toMatchObject({ count: 0, results: [] });
    }
    scenario = "error";
    for (const path of [
      "activities",
      "activities/parents",
      `activities/${child.id}`,
    ]) {
      const response = await fetch(`${API_URL}${path}`);
      expect(response.status).toBe(HttpStatusCode.InternalServerError);
      expect(await response.json()).toMatchObject({
        error: "InternalServerError",
      });
    }
  });

  it("keeps loading requests pending until the browser reloads", async () => {
    scenario = "loading";
    const controller = new AbortController();
    const completed = vi.fn();
    const request = fetch(`${API_URL}activities`, {
      signal: controller.signal,
    });
    void request.then(completed, completed);
    const rejected = expect(request).rejects.toMatchObject({
      name: "AbortError",
    });
    await new Promise((resolve) => setTimeout(resolve, LOADING_CHECK_DELAY_MS));
    expect(completed).not.toHaveBeenCalled();
    controller.abort();
    await rejected;
  });

  it("approves and cancels only the selected activities and supports bulk queries", async () => {
    const approve = new URL(API_URL_OLD, location.origin);
    approve.searchParams.set("action", "ApproveActivities");
    approve.searchParams.set("query", `id:${child.id}`);
    expect(await (await fetch(approve)).json()).toEqual([String(child.id)]);
    expect(await get(`activities/${child.id}`)).toMatchObject({
      activity_status: "undelivered",
      actions: { approvable: false, cancelable: true },
    });
    approve.searchParams.set("action", "CancelActivities");
    approve.searchParams.delete("query");
    approve.searchParams.set("activity_ids[]", String(child.id));
    expect(await (await fetch(approve)).json()).toEqual([child.id]);
    expect(await get(`activities/${child.id}`)).toMatchObject({
      activity_status: "canceled",
      actions: { reappliable: true, cancelable: false },
    });
    approve.searchParams.delete("activity_ids[]");
    expect(await (await fetch(approve)).json()).toEqual([]);
    expect(
      await post("activities/reapply", { activity_ids: [child.id] }),
    ).toEqual([child.id]);
    expect(await get(`activities/${child.id}`)).toMatchObject({
      activity_status: "undelivered",
      completion_time: null,
      result_text: null,
    });
  });

  it("serves linked user details, pending deletion, pending-field helpers and distinct edit-operation groups", async () => {
    const users = await get<ApiPaginatedResponse<User>>("users");
    const pending = users.results.filter(
      ({ pending_activity }) => pending_activity,
    );
    expect(pending).toHaveLength(3);
    for (const user of pending) {
      assert(user.pending_activity);
      expect(
        await get(`activities/${user.pending_activity.activity_id}`),
      ).toMatchObject({
        summary: user.pending_activity.summary,
        type: expect.not.stringMatching("ActivityGroup"),
      });
    }
    const history = await get<{ results: UserActivityEvent[] }>(
      "computers/1/users/user1/pending-activities",
    );
    for (const event of history.results) {
      expect(await get(`activities/${event.activity_id}`)).toMatchObject({
        summary: event.summary,
      });
    }
    const edits = await Promise.all([
      post("users:edit"),
      post("computers/1/usergroups/update_bulk", { action: "add" }),
      post("computers/1/usergroups/update_bulk", { action: "remove" }),
    ]);
    expect(new Set(edits.map((edit) => (edit as ActivityGroup).id)).size).toBe(
      3,
    );
    for (const path of ["users", "users/lock", "users/unlock"]) {
      expect(await post(path)).toMatchObject({ type: "ActivityGroup" });
    }
    expect((await fetch(`${API_URL}users`, { method: "DELETE" })).status).toBe(
      HttpStatusCode.Ok,
    );
  });

  it("links script last runs, run history and USG notifications to actual groups", async () => {
    const profiles =
      await get<ApiPaginatedResponse<ScriptProfile>>("script-profiles");
    for (const profile of profiles.results) {
      expect(profile.activities.last_activity).toMatchObject({
        id: group.id,
        type: "ActivityGroup",
      });
    }
    const details = await get<ScriptProfile>("script-profiles/1");
    expect(details.activities.last_activity?.id).toBe(group.id);
    expect((await fetch(`${API_URL}script-profiles/0`)).status).toBe(
      HttpStatusCode.NotFound,
    );
    const archived = await get<ApiPaginatedResponse<ScriptProfile>>(
      "script-profiles?archived=archived",
    );
    expect(archived.results.every(({ archived: value }) => value)).toBe(true);
    const all = await get<ApiPaginatedResponse<ScriptProfile>>(
      "script-profiles?archived=all&search=Script&limit=1&offset=1",
    );
    expect(all.results).toHaveLength(1);
    const history = await get<ApiPaginatedResponse<ActivityGroup>>(
      "script-profiles/1/activities",
    );
    expect(history.count).toBe(activityDemoGroups.length);
    expect(await post("usg-profiles/1:execute")).toMatchObject({
      id: group.id,
      type: "ActivityGroup",
    });
    const types = new URL(API_URL_OLD, location.origin);
    types.searchParams.set("action", "GetActivityTypes");
    expect(await (await fetch(types)).json()).toEqual([
      ...new Set(activityDemoChildren.map(({ type }) => type)),
    ]);
  });
});
