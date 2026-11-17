import type {
  Fix,
  KernelManagementInfo,
  LivepatchInformation,
} from "@/features/kernel";

export const kernelManagementInfo: KernelManagementInfo = {
  downgrades: [
    { id: 10, name: "linux", version: "5.4.0-99", version_rounded: "5.4.0-99" },
  ],
  installed: {
    id: 11,
    name: "linux",
    version: "5.4.0-100",
    version_rounded: "5.4.0-100",
  },
  message: "",
  smart_status: "Kernel upgrade available",
  upgrades: [
    {
      id: 12,
      name: "linux",
      version: "5.4.0-101",
      version_rounded: "5.4.0-101",
    },
  ],
};

/** Deliberately unsorted, so sorting is observable. */
export const unsortedPatches: Fix[] = [
  {
    Name: "cve-2013-1800",
    Patched: true,
    Bug: "bug-b",
    Description: "Middle description",
  },
  {
    Name: "cve-2013-1900",
    Patched: false,
    Bug: "bug-c",
    Description: "Last description",
  },
  {
    Name: "cve-2013-1700",
    Patched: false,
    Bug: "bug-a",
    Description: "First description",
  },
];

export const buildLivepatchInfo = (
  fixes: Fix[] = unsortedPatches,
): LivepatchInformation => ({
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
            Kernel: "5.4.0-100-generic",
            Running: true,
            Supported: "Supported",
            UpgradeRequiredDate: "2026-10-20",
            Livepatch: {
              CheckState: "checked",
              State: "applied",
              Version: "Version",
              Fixes: fixes,
            },
          },
        ],
      },
    },
  },
});

export const patches: Fix[] = [
  {
    Name: "cve-2013-1797",
    Patched: false,
    Bug: "bug-1",
    Description: "Test description 1",
  },
  {
    Name: "cve-2013-1798",
    Patched: false,
    Bug: "bug-2",
    Description: "Test description 2",
  },
  {
    Name: "cve-2013-1799",
    Patched: false,
    Bug: "bug-3",
    Description: "Test description 3",
  },
  {
    Name: "cve-2013-1800",
    Patched: true,
    Bug: "bug-4",
    Description: "Test description 4",
  },
  {
    Name: "cve-2013-1801",
    Patched: true,
    Bug: "bug-5",
    Description: "Test description 5",
  },
  {
    Name: "cve-2013-1802",
    Patched: true,
    Bug: "bug-6",
    Description: "Test description 6",
  },
  {
    Name: "cve-2013-1803",
    Patched: false,
    Bug: "bug-7",
    Description: "Test description 7",
  },
];
