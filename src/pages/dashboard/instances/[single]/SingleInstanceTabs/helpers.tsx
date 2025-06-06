import type { Instance } from "@/types/Instance";
import { Badge, Spinner } from "@canonical/react-components";
import { TAB_LINKS } from "./constants";

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
  return TAB_LINKS.filter((link) =>
    link.condition(instance.distribution_info?.distributor ?? ""),
  ).map(({ label, id }) => ({
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
