import { http, HttpResponse } from "msw";
import { API_URL, API_URL_OLD } from "@/constants";
import { userGroups } from "@/tests/mocks/userGroup";
import { GroupsResponse } from "@/types/User";
import { GetGroupsParams, GetUserGroupsParams } from "@/hooks/useUsers";
import { GetInstancesParams } from "@/hooks/useInstances";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { Instance, PendingInstance } from "@/types/Instance";
import { generatePaginatedResponse, isAction } from "./_helpers";
import { instances, pendingInstances } from "@/tests/mocks/instance";
import { getEndpointStatus } from "@/tests/controllers/controller";

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
];
