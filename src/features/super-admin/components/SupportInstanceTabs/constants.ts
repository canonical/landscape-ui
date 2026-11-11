import { getFeatures } from "@/features/instances";
import type { Instance } from "@/types/Instance";
import type { FC, LazyExoticComponent } from "react";
import { lazy } from "react";
import type { SupportInstanceTabProps } from "../../types";

type InstanceFeatures = ReturnType<typeof getFeatures>;

interface SupportInstanceTab {
  /** The value of the `tab` page param. */
  readonly id: string;
  readonly label: string;
  readonly hasTable: boolean;
  /** Whether instances with these features have the tab. Always, if omitted. */
  readonly isIncluded?: (features: InstanceFeatures) => boolean;
  readonly Panel: LazyExoticComponent<FC<SupportInstanceTabProps>>;
}

// The tabs of the customer's instance page, in its order. Each tab is its own
// component, so that one can be built without touching the others.
export const SUPPORT_INSTANCE_TABS: readonly SupportInstanceTab[] = [
  {
    id: "info",
    label: "Info",
    hasTable: false,
    Panel: lazy(async () => import("../SupportInstanceInfo")),
  },
  {
    id: "wsl",
    label: "WSL",
    hasTable: true,
    isIncluded: ({ wsl }) => wsl,
    Panel: lazy(async () => import("../SupportInstanceWsl")),
  },
  {
    id: "activities",
    label: "Activities",
    hasTable: true,
    Panel: lazy(async () => import("../SupportInstanceActivities")),
  },
  {
    id: "kernel",
    label: "Kernel",
    hasTable: true,
    isIncluded: ({ packages }) => packages,
    Panel: lazy(async () => import("../SupportInstanceKernel")),
  },
  {
    id: "security-issues",
    label: "Security issues",
    hasTable: true,
    isIncluded: ({ packages }) => packages,
    Panel: lazy(async () => import("../SupportInstanceSecurityIssues")),
  },
  {
    id: "packages",
    label: "Packages",
    hasTable: true,
    isIncluded: ({ packages }) => packages,
    Panel: lazy(async () => import("../SupportInstancePackages")),
  },
  {
    id: "snaps",
    label: "Snaps",
    hasTable: true,
    isIncluded: ({ snaps }) => snaps,
    Panel: lazy(async () => import("../SupportInstanceSnaps")),
  },
  {
    id: "processes",
    label: "Processes",
    hasTable: true,
    isIncluded: ({ processes }) => processes,
    Panel: lazy(async () => import("../SupportInstanceProcesses")),
  },
  {
    id: "ubuntu-pro",
    label: "Ubuntu Pro",
    hasTable: true,
    isIncluded: ({ pro }) => pro,
    Panel: lazy(async () => import("../SupportInstanceUbuntuPro")),
  },
  {
    id: "users",
    label: "Users",
    hasTable: true,
    isIncluded: ({ users }) => users,
    Panel: lazy(async () => import("../SupportInstanceUsers")),
  },
  {
    id: "hardware",
    label: "Hardware",
    hasTable: false,
    isIncluded: ({ hardware }) => hardware,
    Panel: lazy(async () => import("../SupportInstanceHardware")),
  },
];

/** The tabs `instance` has. */
export const getSupportInstanceTabs = (
  instance: Instance,
): SupportInstanceTab[] => {
  const features = getFeatures(instance);

  return SUPPORT_INSTANCE_TABS.filter(
    ({ isIncluded }) => !isIncluded || isIncluded(features),
  );
};

/** Whether the tab the `tab` page param names renders a table. */
export const isSupportInstanceTableTab = (tab: string): boolean =>
  SUPPORT_INSTANCE_TABS.some(({ id, hasTable }) => hasTable && id === tab);
