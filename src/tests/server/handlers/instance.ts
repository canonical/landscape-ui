import { API_URL, API_URL_OLD } from "@/constants";
import type { Activity } from "@/features/activities";
import type {
  GetInstanceParams,
  GetInstancesParams,
  RemoveInstancesParams,
  SanitizeInstanceParams,
} from "@/features/instances";
import type { GetGroupsParams, GetUserGroupsParams } from "@/hooks/useUsers";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { activities } from "@/tests/mocks/activity";
import { instances, pendingInstances } from "@/tests/mocks/instance";
import { userGroups } from "@/tests/mocks/userGroup";
import type { ApiPaginatedResponse } from "@/types/api/ApiPaginatedResponse";
import type { Instance, PendingInstance } from "@/types/Instance";
import type { GroupsResponse } from "@/types/User";
import { delay, http, HttpResponse } from "msw";
import { generatePaginatedResponse, isAction } from "./_helpers";

export default [
  http.get<never, GetInstancesParams, ApiPaginatedResponse<Instance>>(
    `${API_URL}computers`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw new HttpResponse(null, { status: 500 });
      }

      const url = new URL(request.url);
      const offset = Number(url.searchParams.get("offset")) || 0;
      const limit = Number(url.searchParams.get("limit")) || 1;
      const query = url.searchParams.get("query") || "";

      if (query.includes("has-pro-management:false")) {
        return HttpResponse.json(
          generatePaginatedResponse<Instance>({
            data: [instances[1], instances[2]],
            limit,
            offset,
          }),
        );
      }

      if (query.includes("access-group:singular-access-group")) {
        return HttpResponse.json(
          generatePaginatedResponse<Instance>({
            data: [instances[0]],
            limit,
            offset,
          }),
        );
      }

      if (query.includes("access-group:empty-access-group")) {
        return HttpResponse.json(
          generatePaginatedResponse<Instance>({
            data: [],
            limit,
            offset,
          }),
        );
      }

      return HttpResponse.json(
        generatePaginatedResponse<Instance>({
          data: instances,
          limit,
          offset,
        }),
      );
    },
  ),

  http.get<never, GetInstanceParams, Instance>(
    `${API_URL}computers/:computerId`,
    async ({ request }) => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw new HttpResponse(null, { status: 500 });
      }

      const url = new URL(request.url);
      const computerId = url.pathname.split("/").pop();

      return HttpResponse.json(
        instances.find((inst) => inst.id === Number(computerId)) || null,
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

    const endpointStatus = getEndpointStatus();
    if (
      endpointStatus.path === "GetPendingComputers" &&
      endpointStatus.status === "empty"
    ) {
      return HttpResponse.json([]);
    }

    return HttpResponse.json(pendingInstances);
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, ["RebootComputers", "ShutdownComputers"])) {
      return;
    }

    return HttpResponse.json(activities[0]);
  }),

  http.post<never, SanitizeInstanceParams, Activity>(
    `${API_URL}computers/:computerId/sanitize`,
    async () => {
      return HttpResponse.json(activities[0]);
    },
  ),

  http.get<never, RemoveInstancesParams, Instance[]>(
    API_URL_OLD,
    async ({ request }) => {
      if (!isAction(request, ["RemoveComputers"])) {
        return;
      }
      await delay();

      return HttpResponse.json(instances);
    },
  ),

  http.get(API_URL_OLD, async ({ request }) => {
    if (!isAction(request, ["AddTagsToComputers"])) {
      return;
    }
    await delay();

    return HttpResponse.json(instances);
  }),
];
