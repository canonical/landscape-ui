import { API_URL, API_URL_OLD } from "@/constants";
import type { Activity } from "@/features/activities";
import type { WslInstanceType } from "@/features/wsl";
import type { MakeWindowsInstancesCompliantParams } from "@/features/wsl-profiles";
import { wslInstanceNames } from "@/tests/mocks/wsl";
import { http, HttpResponse } from "msw";
import { isAction } from "./_helpers";

export default [
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
    return HttpResponse.json();
  }),

  http.get(API_URL_OLD, ({ request }) => {
    if (!isAction(request, ["SetDefaultChildComputer"])) {
      return;
    }

    return HttpResponse.json();
  }),

  http.post(`${API_URL}computers/:parent_id/delete-children`, () => {
    return HttpResponse.json();
  }),

  http.get(`${API_URL}wsl-feature-limits`, () => {
    return HttpResponse.json<{
      max_windows_host_machines: number;
      max_wsl_child_instances_per_host: number;
      max_wsl_child_instance_profiles: number;
    }>({
      max_windows_host_machines: 100,
      max_wsl_child_instance_profiles: 10,
      max_wsl_child_instances_per_host: 10,
    });
  }),
];
