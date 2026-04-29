import { API_URL, API_URL_OLD } from "@/constants";
import type { Activity } from "@/features/activities";
import type {
  DistributionUpgradeTarget,
  RemoveInstancesParams,
  SanitizeInstanceParams,
} from "@/features/instances";
import type { GetGroupsParams, GetUserGroupsParams } from "@/hooks/useUsers";
import { getEndpointStatus } from "@/tests/controllers/controller";
import {
  activities,
  getMockRecoveryKeyActivity,
  RELEASE_UPGRADE_ACTIVITY,
} from "@/tests/mocks/activity";
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
import type { Instance, PendingInstance } from "@/types/Instance";
import type { GroupsResponse } from "@/types/User";
import { delay, http, HttpResponse } from "msw";
import {
  generatePaginatedResponse,
  isAction,
  shouldApplyEndpointStatus,
} from "./_helpers";
import { createEndpointStatusError } from "./_constants";

export default [
  http.get(
    `${API_URL}computers`,
    async ({ request }) => {
      const url = new URL(request.url);
      const query = url.searchParams.get("query") || "";

      if (shouldApplyEndpointStatus("computers")) {
        const { status, path } = getEndpointStatus();

        if (
          status === "error" &&
          path === "computers-tagged-loading" &&
          query.includes(" OR ")
        ) {
          return new Promise<never>(() => undefined);
        }

        if (
          status === "error" &&
          (!path ||
            path === "computers" ||
            (path === "computers-tagged-error" && query.includes(" OR ")))
        ) {
          throw createEndpointStatusError();
        }
      }

      const offset = Number(url.searchParams.get("offset")) || 0;
      const limit = Number(url.searchParams.get("limit")) || 1;

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

      const currentRelease = instance?.distribution_info
        ? {
            name: instance.distribution_info.description,
            version: instance.distribution_info.release,
          }
        : null;

      const mockedIneligibleReasonById: Record<
        number,
        NonNullable<DistributionUpgradeTarget["reason"]>
      > = {
        11: {
          code: "client_upgrade_required",
          detail: "Client update required before distribution upgrade.",
        },
        21: {
          code: "no_meta_release",
          detail: "Meta-release information is currently unavailable.",
        },
        65: {
          code: "lts_only_no_lts_target",
          detail: "Policy only allows LTS upgrades and no target is available.",
        },
      };

      if (!instance) {
        return {
          computer_id: id,
          computer_title: "Unknown Instance",
          current_release: null,
          target_release: null,
          reason: {
            code: "instance_not_found",
            detail: `Instance with id ${id} not found.`,
          },
        };
      }

      if (!instance.distribution_info) {
        return {
          computer_id: id,
          computer_title: instance.title,
          current_release: null,
          target_release: null,
          reason: {
            code: "no_distribution",
            detail:
              "No distribution information is available for this instance.",
          },
        };
      }

      if (instance.distribution_info.distributor === "Ubuntu Core") {
        return {
          computer_id: id,
          computer_title: instance.title,
          current_release: currentRelease,
          target_release: null,
          reason: {
            code: "policy_disabled",
            detail: "Policy is preventing distribution upgrades.",
          },
        };
      }

      if (
        instance.distribution_info.distributor !== "Canonical" &&
        instance.distribution_info.distributor !== "Ubuntu"
      ) {
        return {
          computer_id: id,
          computer_title: instance.title,
          current_release: currentRelease,
          target_release: null,
          reason: {
            code: "unsupported_release",
            detail: "This distribution is not supported for release upgrades.",
          },
        };
      }

      const mockedIneligibleReason = mockedIneligibleReasonById[id];

      if (mockedIneligibleReason) {
        return {
          computer_id: id,
          computer_title: instance.title,
          current_release: currentRelease,
          target_release: null,
          reason: mockedIneligibleReason,
        };
      }

      if (
        instance.distribution_info &&
        instance.distribution_info.release < "18.04"
      ) {
        return {
          computer_id: id,
          computer_title: instance.title,
          current_release: {
            name: "Ubuntu 18.04 LTS",
            version: "18.04",
          },
          target_release: {
            code_name: "focal",
            name: "Ubuntu 20.04 LTS",
            version: "20.04",
          },
          reason: null,
        };
      }

      if (instance.distribution_info?.release === "22.04") {
        return {
          computer_id: id,
          computer_title: instance.title,
          current_release: {
            name: "Ubuntu 22.04 LTS",
            version: "22.04",
          },
          target_release: {
            code_name: "noble",
            name: "Ubuntu 24.04 LTS",
            version: "24.04",
          },
          reason: null,
        };
      }

      return {
        computer_id: id,
        computer_title: instance.title,
        current_release: currentRelease,
        target_release: null,
        reason: {
          code: "no_upgrade_target",
          detail: "No release upgrades are available.",
        },
      };
    });

    return HttpResponse.json({ results });
  }),

  http.post(`${API_URL}computers/release-upgrades`, async () => {
    if (shouldApplyEndpointStatus("computers/release-upgrades")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusError();
      }
    }

    const releaseUpgradeActivity = RELEASE_UPGRADE_ACTIVITY;
    return HttpResponse.json(releaseUpgradeActivity);
  }),

  http.post(`${API_URL}computers/upgrade-packages`, async () => {
    if (shouldApplyEndpointStatus("computers/upgrade-packages")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusError();
      }
    }

    return HttpResponse.json(activities[0]);
  }),

  http.post(
    `${API_URL}computers/:computerId/restart`,
    async () => {
      if (shouldApplyEndpointStatus("computers/:computerId/restart")) {
        const { status } = getEndpointStatus();
        if (status === "error") {
          throw createEndpointStatusError();
        }
      }

      return HttpResponse.json(activities[0]);
    },
  ),

  http.get(
    `${API_URL}computers/:computerId`,
    async ({ request }) => {
      if (shouldApplyEndpointStatus("computers/:computerId")) {
        const { status } = getEndpointStatus();
        if (status === "error") {
          throw createEndpointStatusError();
        }
      }

      const url = new URL(request.url);
      const computerId = url.pathname.split("/").pop();

      return HttpResponse.json(
        instances.find((inst) => inst.id === Number(computerId)) || null,
      );
    },
  ),

  http.put(`${API_URL}computers/:computerId`, async () => {
    if (shouldApplyEndpointStatus("editInstance")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusError();
      }
    }

    return HttpResponse.json(instances[0]);
  }),

  http.post(
    `${API_URL}computers/:computerId/usergroups/update_bulk`,
    async () => {
      if (shouldApplyEndpointStatus("userGroups")) {
        const { status } = getEndpointStatus();
        if (status === "error") {
          throw createEndpointStatusError();
        }
      }

      return HttpResponse.json(activities[0]);
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
    const endpointStatus = getEndpointStatus();
    const daemonGroups = userGroups.filter((group) => group.name === "daemon");
    const shouldReturnEmptyGroups =
      endpointStatus.status === "empty" &&
      (!endpointStatus.path || endpointStatus.path === "users/groups");
    const shouldReturnDaemonGroupOnly =
      endpointStatus.path === "users/groups:daemon";

    if (shouldReturnEmptyGroups) {
      return HttpResponse.json({ groups: [] });
    }

    if (shouldReturnDaemonGroupOnly) {
      return HttpResponse.json({ groups: daemonGroups });
    }

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
      const instance = instances.find((inst) => inst.id === computerId);

      if (!instance) {
        return new HttpResponse(null, { status: 404 });
      }

      if (instance.distribution_info?.distributor === "Microsoft") {
        return HttpResponse.json({
          activity: null,
          fde_recovery_key: null,
        });
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

  http.post(`${API_URL}computers\\:delete`, async () => {
    await delay();
    return HttpResponse.json();
  }),

  http.get(API_URL_OLD, async ({ request }) => {
    if (!isAction(request, ["AddTagsToComputers"])) {
      return;
    }
    await delay();

    return HttpResponse.json(instances);
  }),
];
