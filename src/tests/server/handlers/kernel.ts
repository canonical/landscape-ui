import { API_URL } from "@/constants";
import type { Activity } from "@/features/activities";
import type {
  KernelManagementInfo,
  LivepatchInformation,
} from "@/features/kernel";
import { getEndpointStatus } from "@/tests/controllers/controller";
import { activities } from "@/tests/mocks/activity";
import { http, HttpResponse } from "msw";
import { createEndpointStatusError } from "./_constants";

export default [
  http.get<never, never, KernelManagementInfo>(
    `${API_URL}computers/:computerId/livepatch/kernel`,
    async () => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "empty") {
        return HttpResponse.json<KernelManagementInfo>({
          downgrades: [],
          installed: null,
          message: "Kernel information is not available for this instance.",
          smart_status: "",
          upgrades: [],
        });
      }

      return HttpResponse.json<KernelManagementInfo>({
        downgrades: [],
        installed: {
          id: 0,
          name: "Kernel",
          version: "1",
          version_rounded: "1",
        },
        message: "",
        smart_status: "",
        upgrades: [],
      });
    },
  ),

  http.get<never, never, LivepatchInformation>(
    `${API_URL}computers/:computerId/livepatch/info`,
    async () => {
      return HttpResponse.json<LivepatchInformation>({
        ubuntu_pro_livepatch_service_info: null,
        ubuntu_pro_reboot_required_info: null,
        livepatch_info: {
          json: {
            error: "",
            return_code: 0,
            output: {
              tier: "tier",
              Status: [
                {
                  Livepatch: {
                    Fixes: [
                      {
                        Bug: "Bug",
                        Description: "Description",
                        Name: "Name",
                        Patched: false,
                      },
                      {
                        Bug: "Bug",
                        Description: "Description",
                        Name: "Name",
                        Patched: false,
                      },
                      {
                        Bug: "Bug",
                        Description: "Description",
                        Name: "Name",
                        Patched: false,
                      },
                      {
                        Bug: "Bug",
                        Description: "Description",
                        Name: "Name",
                        Patched: false,
                      },
                    ],
                    CheckState: "CheckState",
                    State: "State",
                    Version: "Version",
                  },
                  Kernel: "Kernel",
                  Running: true,
                  Supported: "Supported",
                  UpgradeRequiredDate: null,
                },
              ],
            },
          },
        },
      });
    },
  ),
  http.post<never, never, Activity>(
    `${API_URL}computers/:id/kernel/upgrade`,
    async () => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }

      return HttpResponse.json(activities[0]);
    },
  ),

  http.post<never, never, Activity>(
    `${API_URL}computers/:id/kernel/downgrade`,
    async () => {
      const endpointStatus = getEndpointStatus();

      if (endpointStatus.status === "error") {
        throw createEndpointStatusError();
      }

      return HttpResponse.json(activities[0]);
    },
  ),
];
