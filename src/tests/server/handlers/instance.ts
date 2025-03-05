import { API_URL, API_URL_OLD } from "@/constants";
import type { Activity } from "@/features/activities";
import type {
  GetInstancesParams,
  RemoveInstances,
  SanitizeInstancesParams,
} from "@/hooks/useInstances";
import type { GetGroupsParams, GetUserGroupsParams } from "@/hooks/useUsers";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { activities } from "@/tests/mocks/activity";
import { instances, pendingInstances } from "@/tests/mocks/instance";
import { userGroups } from "@/tests/mocks/userGroup";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import type { Instance, PendingInstance } from "@/types/Instance";
import type { GroupsResponse } from "@/types/User";
import { delay, http, HttpResponse } from "msw";
import { generatePaginatedResponse, isAction } from "./_helpers";

export default [
  http.get<never, GetInstancesParams, ApiPaginatedResponse<Instance>>(
    `${API_URL}computers`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus === "error") {
        throw new HttpResponse(null, { status: 500 });
      }

      const url = new URL(request.url);
      const offset = Number(url.searchParams.get("offset")) || 0;
      const limit = Number(url.searchParams.get("limit")) || 1;

      return HttpResponse.json(
        generatePaginatedResponse<Instance>({
          data: instances,
          limit,
          offset,
        }),
      );
    },
  ),

  http.get<Record<"computerId", string>, GetGroupsParams, GroupsResponse>(
    `${API_URL}computers/:computerId/groups`,
    () => {
      return HttpResponse.json({ groups: userGroups });
    },
  ),

  http.get<
    Record<"computerId" | "username", string>,
    GetUserGroupsParams,
    GroupsResponse
  >(`${API_URL}computers/:computerId/users/:username/groups`, () => {
    return HttpResponse.json({ groups: userGroups });
  }),

  http.get<never, never, PendingInstance[]>(API_URL_OLD, ({ request }) => {
    if (!isAction(request, "GetPendingComputers")) {
      return;
    }

    return HttpResponse.json(pendingInstances);
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, ["RebootComputers", "ShutdownComputers"])) {
      return;
    }

    return HttpResponse.json(activities[0]);
  }),

  http.post<never, SanitizeInstancesParams, Activity>(
    `${API_URL}computers/:computerId/sanitize`,
    async () => {
      return HttpResponse.json(activities[0]);
    },
  ),

  http.get<never, RemoveInstances, Instance[]>(
    API_URL_OLD,
    async ({ request }) => {
      if (!isAction(request, ["RemoveComputers"])) {
        return;
      }
      await delay();

      return HttpResponse.json(instances);
    },
  ),
];
