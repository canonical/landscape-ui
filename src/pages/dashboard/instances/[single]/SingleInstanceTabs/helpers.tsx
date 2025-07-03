import { getFeatures } from "@/features/instances";
import useAuth from "@/hooks/useAuth";
import type { Instance } from "@/types/Instance";
import { Badge, Spinner } from "@canonical/react-components";

interface GetTabLabelProps {
  id: string;
  label: string;
  packageCount: number | undefined;
  packagesLoading: boolean;
  usnCount: number | undefined;
  usnLoading: boolean;
  kernelCount: number | undefined;
  kernelLoading: boolean;
}

const getTabLabel = ({
  id,
  label,
  packageCount,
  packagesLoading,
  usnCount,
  usnLoading,
  kernelCount,
  kernelLoading,
}: GetTabLabelProps) => {
  if (
    (id === "tab-link-packages" && packagesLoading) ||
    (id === "tab-link-security-issues" && usnLoading) ||
    (id === "tab-link-kernel" && kernelLoading)
  ) {
    return (
      <>
        <span>{label}</span>
        <Spinner className="u-no-margin--bottom u-no-padding--top" />
      </>
    );
  }

  if (id === "tab-link-packages" && packageCount) {
    return (
      <>
        <span>{label}</span>
        <Badge value={packageCount} />
      </>
    );
  }

  if (id === "tab-link-security-issues" && usnCount) {
    return (
      <>
        <span>{label}</span>
        <Badge value={usnCount} isNegative />
      </>
    );
  }

  if (id === "tab-link-kernel" && kernelCount) {
    return (
      <>
        <span>{label}</span>
        <Badge value={kernelCount} />
      </>
    );
  }

  return label;
};

interface GetTabLinksProps {
  activeTabId: string;
  instance: Instance;
  onActiveTabChange: (tabId: string) => void;
  packageCount: number | undefined;
  packagesLoading: boolean;
  usnCount: number | undefined;
  usnLoading: boolean;
  kernelCount: number | undefined;
  kernelLoading: boolean;
}

export const getTabLinks = ({
  activeTabId,
  instance,
  onActiveTabChange,
  packageCount,
  packagesLoading,
  usnCount,
  usnLoading,
  kernelCount,
  kernelLoading,
}: GetTabLinksProps) => {
  const { isFeatureEnabled } = useAuth();

  const tabLinks: {
    label: string;
    id: string;
    included: boolean;
  }[] = [
    {
      label: "Info",
      id: "tab-link-info",
      included: true,
    },
    {
      label: "WSL",
      id: "tab-link-wsl",
      included:
        getFeatures(instance).wsl &&
        isFeatureEnabled("wsl-child-instance-profiles"),
    },
    {
      label: "Activities",
      id: "tab-link-activities",
      included: true,
    },
    {
      label: "Kernel",
      id: "tab-link-kernel",
      included: getFeatures(instance).packages,
    },
    {
      label: "Security issues",
      id: "tab-link-security-issues",
      included: getFeatures(instance).packages,
    },
    {
      label: "Packages",
      id: "tab-link-packages",
      included: getFeatures(instance).packages,
    },
    {
      label: "Snaps",
      id: "tab-link-snaps",
      included: getFeatures(instance).snaps,
    },
    {
      label: "Processes",
      id: "tab-link-processes",
      included: getFeatures(instance).processes,
    },
    {
      label: "Ubuntu Pro",
      id: "tab-link-ubuntu-pro",
      included: getFeatures(instance).pro,
    },
    {
      label: "Users",
      id: "tab-link-users",
      included: getFeatures(instance).users,
    },
    {
      label: "Hardware",
      id: "tab-link-hardware",
      included: getFeatures(instance).hardware,
    },
  ];

  return tabLinks
    .filter((link) => link.included)
    .map(({ label, id }) => ({
      label: getTabLabel({
        label,
        id,
        packageCount,
        packagesLoading,
        usnCount,
        usnLoading,
        kernelCount,
        kernelLoading,
      }),
      id,
      role: "tab",
      active: id === activeTabId,
      onClick: () => {
        onActiveTabChange(id);
      },
    }));
};
