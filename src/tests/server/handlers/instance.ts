import { http, HttpResponse } from "msw";
import { API_URL, API_URL_OLD, COMMON_NUMBERS } from "@/constants";
import { userGroups } from "@/tests/mocks/userGroup";
import type { GroupsResponse } from "@/types/User";
import type { GetGroupsParams, GetUserGroupsParams } from "@/hooks/useUsers";
import type { GetInstancesParams } from "@/hooks/useInstances";
import type { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import type { Instance, PendingInstance } from "@/types/Instance";
import { generatePaginatedResponse, isAction } from "./_helpers";
import { instances, pendingInstances } from "@/tests/mocks/instance";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { activities } from "@/tests/mocks/activity";

export default [
  http.get<never, GetInstancesParams, ApiPaginatedResponse<Instance>>(
    `${API_URL}computers`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw new HttpResponse(null, { status: 500 });
      }

      const url = new URL(request.url);
      const offset =
        Number(url.searchParams.get("offset")) || COMMON_NUMBERS.ZERO;
      const limit = Number(url.searchParams.get("limit")) || COMMON_NUMBERS.ONE;

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

    return HttpResponse.json(activities[COMMON_NUMBERS.ZERO]);
  }),
];
