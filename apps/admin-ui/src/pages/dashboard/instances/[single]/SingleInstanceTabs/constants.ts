import type { Instance } from "@/types/Instance";

const DISTRIBUTORS = {
  ubuntu: "Ubuntu",
  ubuntuCore: "Ubuntu Core",
  windows: "Microsoft",
};

export const TAB_LINKS: {
  label: string;
  id: string;
  condition: (instance: Instance) => boolean;
}[] = [
  {
    label: "Info",
    id: "tab-link-info",
    condition: () => true,
  },
  {
    label: "WSL",
    id: "tab-link-wsl",
    condition: (instance) =>
      instance.distribution_info?.distributor === DISTRIBUTORS.windows,
  },
  {
    label: "Activities",
    id: "tab-link-activities",
    condition: () => true,
  },
  {
    label: "Kernel",
    id: "tab-link-kernel",
    condition: (instance) =>
      instance.distribution_info?.distributor === DISTRIBUTORS.ubuntu,
  },
  {
    label: "Security issues",
    id: "tab-link-security-issues",
    condition: (instance) =>
      instance.distribution_info?.distributor === DISTRIBUTORS.ubuntu,
  },
  {
    label: "Packages",
    id: "tab-link-packages",
    condition: (instance) =>
      instance.distribution_info?.distributor === DISTRIBUTORS.ubuntu,
  },
  {
    label: "Snaps",
    id: "tab-link-snaps",
    condition: (instance) =>
      instance.distribution_info?.distributor !== DISTRIBUTORS.windows,
  },
  {
    label: "Processes",
    id: "tab-link-processes",
    condition: (instance) =>
      instance.distribution_info?.distributor !== DISTRIBUTORS.windows,
  },
  {
    label: "Ubuntu Pro",
    id: "tab-link-ubuntu-pro",
    condition: (instance) =>
      [
        DISTRIBUTORS.ubuntu,
        DISTRIBUTORS.ubuntuCore,
        DISTRIBUTORS.windows,
      ].includes(instance.distribution_info?.distributor ?? ""),
  },
  {
    label: "Users",
    id: "tab-link-users",
    condition: (instance) =>
      ![DISTRIBUTORS.ubuntuCore, DISTRIBUTORS.windows].includes(
        instance.distribution_info?.distributor ?? "",
      ),
  },
  {
    label: "Hardware",
    id: "tab-link-hardware",
    condition: (instance) =>
      instance.distribution_info?.distributor !== DISTRIBUTORS.windows,
  },
];
