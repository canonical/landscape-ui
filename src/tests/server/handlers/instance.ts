import { API_URL, API_URL_OLD } from "@/constants";
import type { Activity } from "@/features/activities";
import type {
  DistributionUpgradeTarget,
  GetInstanceParams,
  GetInstancesParams,
  RemoveInstancesParams,
  SanitizeInstanceParams,
} from "@/features/instances";
import type { GetGroupsParams, GetUserGroupsParams } from "@/hooks/useUsers";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { activities, getMockRecoveryKeyActivity } from "@/tests/mocks/activity";
import {
  instanceCanceledActivityNoKey,
  instanceCanceledActivityWithKey,
  instanceActivityNoKey,
  instanceActivityWithKey,
  instanceFailedActivityNoKey,
  instanceFailedActivityWithKey,
  instanceNoActivityNoKey,
  instanceNoActivityWithKey,
  instances,
  pendingInstances,
} from "@/tests/mocks/instance";
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

  http.get(`${API_URL}computers/release-upgrade-targets`, ({ request }) => {
    const url = new URL(request.url);
    const idsParam = url.searchParams.get("computer_ids") || "";
    const ids = idsParam
      .split(",")
      .map((id) => Number(id))
      .filter((id) => !Number.isNaN(id));

    const results: DistributionUpgradeTarget[] = ids.map((id) => {
      const instance = instances.find((inst) => inst.id === id);

      if (!instance) {
        return {
          computer_id: id,
          computer_title: "Unknown Instance",
          current_release_name: null,
          current_release_version: null,
          target_release_code_name: null,
          target_release_name: null,
          target_release_version: null,
          reason_code: "instance_not_found",
          reason_detail: `Instance with id ${id} not found.`,
        };
      }

      if (
        instance.distribution_info &&
        instance.distribution_info.release < "18.04"
      ) {
        return {
          computer_id: id,
          computer_title: instance.title,
          current_release_name: "Ubuntu 18.04 LTS",
          current_release_version: "18.04",
          target_release_code_name: "focal",
          target_release_name: "Ubuntu 20.04 LTS",
          target_release_version: "20.04",
          reason_code: null,
          reason_detail: null,
        };
      } else {
        return {
          computer_id: id,
          computer_title: instance.title,
          current_release_name: "Ubuntu 10.04 LTS",
          current_release_version: "10.04",
          target_release_code_name: null,
          target_release_name: null,
          target_release_version: null,
          reason_code: "no_upgrade_target",
          reason_detail: "No release upgrades are available.",
        };
      }
    });

    return HttpResponse.json({ results });
  }),

  http.post(`${API_URL}computers/release-upgrades`, async () => {
    const endpointStatus = getEndpointStatus();

    if (endpointStatus.status === "error") {
      throw new HttpResponse(null, { status: 500 });
    }

    return HttpResponse.json(activities[0]);
  }),

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

  http.post(
    `${API_URL}computers/:computerId/recovery-key:generate`,
    async ({ params }) => {
      const computerId = Number(params.computerId);

      return HttpResponse.json({
        id: 115,
        activity_status: "undelivered",
        completion_time: null,
        creation_time: "2026-01-13T21:57:57Z",
        creator: {
          email: "john@example.com",
          id: 1,
          name: "John Smith",
        },
        computer_id: computerId,
        parent_id: null,
        result_code: null,
        result_text: null,
        summary: `Request computer ${computerId} to generate a FDE recovery key.`,
        type: "GenerateFDERecoveryKeyRequest",
        deliver_delay_window: 0,
      });
    },
  ),

  http.get(
    `${API_URL}computers/:computerId/recovery-key`,
    async ({ params }) => {
      const computerId = Number(params.computerId);
      const hasInstance = instances.some((inst) => inst.id === computerId);

      if (!hasInstance) {
        return new HttpResponse(null, { status: 404 });
      }

      const activity = getMockRecoveryKeyActivity(computerId);

      if (computerId === instanceNoActivityNoKey.id) {
        return HttpResponse.json({
          activity: null,
          fde_recovery_key: null,
        });
      }

      if (computerId === instanceNoActivityWithKey.id) {
        return HttpResponse.json({
          activity: null,
          fde_recovery_key: "12345-12345-12345-12345-12345-12345-12345-12345",
        });
      }

      if (computerId === instanceActivityWithKey.id) {
        return HttpResponse.json({
          activity,
          fde_recovery_key: "12345-12345-12345-12345-12345-12345-12345-12345",
        });
      }

      if (computerId === instanceFailedActivityWithKey.id) {
        return HttpResponse.json({
          activity: {
            ...activity,
            activity_status: "failed",
          },
          fde_recovery_key: "12345-12345-12345-12345-12345-12345-12345-12345",
        });
      }

      if (computerId === instanceCanceledActivityWithKey.id) {
        return HttpResponse.json({
          activity: {
            ...activity,
            activity_status: "canceled",
          },
          fde_recovery_key: "12345-12345-12345-12345-12345-12345-12345-12345",
        });
      }

      if (computerId === instanceFailedActivityNoKey.id) {
        return HttpResponse.json({
          activity: {
            ...activity,
            activity_status: "failed",
          },
          fde_recovery_key: null,
        });
      }

      if (computerId === instanceCanceledActivityNoKey.id) {
        return HttpResponse.json({
          activity: {
            ...activity,
            activity_status: "canceled",
          },
          fde_recovery_key: null,
        });
      }

      if (computerId === instanceActivityNoKey.id) {
        return HttpResponse.json({
          activity,
          fde_recovery_key: null,
        });
      }

      return HttpResponse.json({
        activity,
        fde_recovery_key: "12345-12345-12345-12345-12345-12345-12345-12345",
      });
    },
  ),

  http.delete<Record<"computerId", string>>(
    `${API_URL}computers/:computerId/recovery-key`,
    async () => {
      return new HttpResponse(null, { status: 204 });
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
