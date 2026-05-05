import { API_URL, API_URL_OLD } from "@/constants";
import type { Activity } from "@/features/activities";
import type { WslInstanceType } from "@/features/wsl";
import type { MakeWindowsInstancesCompliantParams } from "@/features/wsl-profiles";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { instanceChildren, wslInstanceNames } from "@/tests/mocks/wsl";
import type { InstanceChild } from "@/types/Instance";
import { delay, http, HttpResponse } from "msw";
import { isAction, shouldApplyEndpointStatus } from "./_helpers";
import { createEndpointStatusError } from "./_constants";

export default [
  http.get<{ id: string }, never, { children: InstanceChild[] }>(
    `${API_URL}computers/:id/children`,
    () => {
      if (shouldApplyEndpointStatus("children")) {
        const { status } = getEndpointStatus();
        if (status === "empty") {
          return HttpResponse.json({ children: [] });
        }
        if (status === "error") {
          throw createEndpointStatusError();
        }
      }

      return HttpResponse.json({ children: instanceChildren });
    },
  ),

  http.get<never, never, WslInstanceType[]>(
    `${API_URL}wsl-instance-names`,
    () => {
      return HttpResponse.json(wslInstanceNames);
    },
  ),

  http.post<never, MakeWindowsInstancesCompliantParams, Activity>(
    `${API_URL}child-instance-profiles/make-hosts-compliant`,
    () => {
      return HttpResponse.json();
    },
  ),

  http.post(`${API_URL}child-instance-profiles/:name\\:reapply`, () => {
    if (shouldApplyEndpointStatus("child-instance-profiles/:name:reapply")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusError();
      }
    }
    return HttpResponse.json();
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, ["SetDefaultChildComputer"])) {
      return;
    }

    if (shouldApplyEndpointStatus("SetDefaultChildComputer")) {
      const { status } = getEndpointStatus();
      if (status === "error") {
        throw createEndpointStatusError();
      }
    }

    return HttpResponse.json();
  }),

  http.post<{ parent_id: string }, never, Activity>(
    `${API_URL}computers/:parent_id/children`,
    () => {
      if (shouldApplyEndpointStatus("create-wsl-instance")) {
        const { status } = getEndpointStatus();
        if (status === "error") {
          throw createEndpointStatusError();
        }
      }

      return HttpResponse.json({
        id: 1010,
        type: "InstallWSLInstance",
        summary: "Install WSL instance",
        computer_id: 1,
        activity_status: "undelivered",
        completion_time: null,
        creation_time: "2024-04-15T15:47:07Z",
        creator: { name: "John Smith", email: "john@example.com", id: 1 },
        parent_id: null,
        result_code: null,
        result_text: null,
        actions: { approvable: false, cancelable: true, reappliable: false },
        approval_time: null,
        delivery_time: null,
        deliver_after_time: null,
        deliver_before_time: null,
        modification_time: "2024-04-15T15:47:07Z",
        schedule_after_time: null,
        schedule_before_time: null,
        children: [],
      });
    },
  ),

  http.post(`${API_URL}computers/:parent_id/delete-children`, () => {
    return HttpResponse.json();
  }),

  http.get(`${API_URL}wsl-feature-limits`, async () => {
    if (shouldApplyEndpointStatus("wsl-feature-limits")) {
      const { status, response } = getEndpointStatus();
      if (status === "loading") {
        await delay("infinite");
      }
      if (status === "variant") {
        return HttpResponse.json(response);
      }
    }

    return HttpResponse.json<{
      max_windows_host_machines: number;
      max_wsl_child_instance_profiles: number;
      max_wsl_child_instances_per_host: number;
    }>({
      max_windows_host_machines: 100,
      max_wsl_child_instance_profiles: 10,
      max_wsl_child_instances_per_host: 10,
    });
  }),
];
