import type { AppTabItem } from "@/components/AppTabs";
import LoadingState from "@/components/layout/LoadingState";
import { getFeatures } from "@/features/instances";
import type { FeatureKey } from "@/types/FeatureKey";
import type { Instance } from "@/types/Instance";
import { Badge } from "@canonical/react-ds-global";
import type { ReactNode } from "react";

interface GetTabSlotProps {
  id: string;
  packageCount: number | undefined;
  packagesLoading: boolean;
  usnCount: number | undefined;
  usnLoading: boolean;
  kernelCount: number | undefined;
  kernelLoading: boolean;
}

const getTabSlot = ({
  id,
  packageCount,
  packagesLoading,
  usnCount,
  usnLoading,
  kernelCount,
  kernelLoading,
}: GetTabSlotProps): ReactNode => {
  if (
    (id === "packages" && packagesLoading) ||
    (id === "security-issues" && usnLoading) ||
    (id === "kernel" && kernelLoading)
  ) {
    return <LoadingState inline />;
  }

  if (id === "packages" && packageCount) {
    return <Badge value={packageCount} />;
  }

  if (id === "security-issues" && usnCount) {
    return <Badge value={usnCount} criticality="error" />;
  }

  if (id === "kernel" && kernelCount) {
    return <Badge value={kernelCount} />;
  }

  return undefined;
};

export type SingleInstanceTabId =
  | "info"
  | "wsl"
  | "activities"
  | "kernel"
  | "security-issues"
  | "packages"
  | "snaps"
  | "processes"
  | "ubuntu-pro"
  | "users"
  | "hardware";

interface GetTabLinksProps {
  instance: Instance;
  isFeatureEnabled: (feature: FeatureKey) => boolean;
  packageCount: number | undefined;
  packagesLoading: boolean;
  usnCount: number | undefined;
  usnLoading: boolean;
  kernelCount: number | undefined;
  kernelLoading: boolean;
}

export const getTabLinks = ({
  instance,
  isFeatureEnabled,
  packageCount,
  packagesLoading,
  usnCount,
  usnLoading,
  kernelCount,
  kernelLoading,
}: GetTabLinksProps): AppTabItem<SingleInstanceTabId>[] => {
  const tabLinks: {
    label: string;
    id: SingleInstanceTabId;
    included: boolean;
  }[] = [
    {
      label: "Info",
      id: "info",
      included: true,
    },
    {
      label: "WSL",
      id: "wsl",
      included:
        getFeatures(instance).wsl &&
        isFeatureEnabled("wsl-child-instance-profiles"),
    },
    {
      label: "Activities",
      id: "activities",
      included: true,
    },
    {
      label: "Kernel",
      id: "kernel",
      included: getFeatures(instance).packages,
    },
    {
      label: "Security issues",
      id: "security-issues",
      included: getFeatures(instance).packages,
    },
    {
      label: "Packages",
      id: "packages",
      included: getFeatures(instance).packages,
    },
    {
      label: "Snaps",
      id: "snaps",
      included: getFeatures(instance).snaps,
    },
    {
      label: "Processes",
      id: "processes",
      included: getFeatures(instance).processes,
    },
    {
      label: "Ubuntu Pro",
      id: "ubuntu-pro",
      included: getFeatures(instance).pro,
    },
    {
      label: "Users",
      id: "users",
      included: getFeatures(instance).users,
    },
    {
      label: "Hardware",
      id: "hardware",
      included: getFeatures(instance).hardware,
    },
  ];

  return tabLinks
    .filter((link) => link.included)
    .map(({ label, id }) => ({
      id,
      label,
      slot: getTabSlot({
        id,
        packageCount,
        packagesLoading,
        usnCount,
        usnLoading,
        kernelCount,
        kernelLoading,
      }),
    }));
};
