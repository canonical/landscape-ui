import { Badge, Spinner } from "@canonical/react-components";
import { Instance } from "@/types/Instance";
import { TAB_LINKS } from "@/pages/dashboard/instances/[single]/SingleInstanceTabs/constants";

interface GetTabLabelProps {
  id: string;
  label: string;
  packageCount: number | undefined;
  packagesLoading: boolean;
  usnCount: number | undefined;
  usnLoading: boolean;
}

const getTabLabel = ({
  id,
  label,
  packageCount,
  packagesLoading,
  usnCount,
  usnLoading,
}: GetTabLabelProps) => {
  if (
    (id === "tab-link-packages" && packagesLoading) ||
    (id === "tab-link-security-issues" && usnLoading)
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
}

export const getTabLinks = ({
  activeTabId,
  instance,
  onActiveTabChange,
  packageCount,
  packagesLoading,
  usnCount,
  usnLoading,
}: GetTabLinksProps) => {
  return TAB_LINKS.filter(({ id }) =>
    !instance.distribution || /\d{1,2}\.\d{2}/.test(instance.distribution)
      ? id !== "tab-link-instances"
      : [
          "tab-link-info",
          "tab-link-instances",
          "tab-link-activities",
          "tab-link-hardware",
        ].includes(id),
  ).map(({ label, id }) => ({
    label: getTabLabel({
      label,
      id,
      packageCount,
      packagesLoading,
      usnCount,
      usnLoading,
    }),
    id,
    role: "tab",
    active: id === activeTabId,
    onClick: () => onActiveTabChange(id),
  }));
};
