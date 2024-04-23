import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import { userGroups } from "@/tests/mocks/userGroup";
import { GroupsResponse } from "@/types/User";
import { GetGroupsParams, GetUserGroupsParams } from "@/hooks/useUsers";
import { GetInstancesParams } from "@/hooks/useInstances";
import { ApiPaginatedResponse } from "@/types/ApiPaginatedResponse";
import { Instance } from "@/types/Instance";
import { generatePaginatedResponse } from "./_helpers";
import { instances } from "@/tests/mocks/instance";
import { getEndpointStatus } from "@/tests/controllers/controller";

export default [
  // @ts-ignore-next-line
  http.get<GetInstancesParams, never, ApiPaginatedResponse<Instance>>(
    `${API_URL}computers`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus === "error") {
        return HttpResponse.json(
          {
            error: "InternalServerError",
            message: "Error response",
          },
          {
            status: 500,
          },
        );
      }

      const url = new URL(request.url);
      const offset = Number(url.searchParams.get("offset")) ?? 0;
      const limit = Number(url.searchParams.get("limit")) ?? 1;

      return HttpResponse.json(
        generatePaginatedResponse<Instance>({
          data: instances,
          limit,
          offset,
        }),
      );
    },
  ),

  // @ts-ignore-next-line
  http.get<GetGroupsParams, never, GroupsResponse>(
    `${API_URL}computers/:computerId/groups`,
    () => {
      return HttpResponse.json({ groups: userGroups });
    },
  ),

  // @ts-ignore-next-line
  http.get<GetUserGroupsParams, never, GroupsResponse>(
    `${API_URL}computers/:computerId/users/:username/groups`,
    () => {
      return HttpResponse.json({ groups: userGroups });
    },
  ),
];
