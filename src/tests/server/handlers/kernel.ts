import { API_URL } from "@/constants";
import type {
  KernelManagementInfo,
  LivepatchInformation,
} from "@/features/kernel";
import { http, HttpResponse } from "msw";

export default [
  http.get<never, never, KernelManagementInfo>(
    `${API_URL}computers/:computerId/livepatch/kernel`,
    async () => {
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
];
