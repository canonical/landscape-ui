import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";
import LoadingState from "@/components/layout/LoadingState";
import { getFeatures } from "@/features/instances";
import usePageParams from "@/hooks/usePageParams";
import { Tabs } from "@canonical/react-components";
import { Badge } from "@canonical/react-ds-global";
import type { FC, ReactNode } from "react";
import { Suspense } from "react";
import {
  useGetStaffInstancePackages,
  useGetStaffLivepatchInfo,
  useGetStaffUsns,
} from "../../api";
import type { SupportInstanceTabProps } from "../../types";
import { getSupportInstanceTabs } from "./constants";
import classes from "./SupportInstanceTabs.module.scss";

const getTabLinkId = (id: string): string => `tab-link-${id}`;

/** The tabs of an instance's page in a support session. */
const SupportInstanceTabs: FC<SupportInstanceTabProps> = ({
  name,
  instance,
}) => {
  const { tab, setPageParams } = usePageParams();

  const hasTabCounts =
    getFeatures(instance).packages && !!instance.distribution;

  const { staffLivepatchInfo, isGettingStaffLivepatchInfo } =
    useGetStaffLivepatchInfo(name, instance.id, { enabled: hasTabCounts });

  const {
    staffInstancePackagesCount: packageCount,
    isGettingStaffInstancePackages,
  } = useGetStaffInstancePackages(
    name,
    instance.id,
    { upgrade: true, limit: 1 },
    { enabled: hasTabCounts },
  );

  const { staffUsnsCount: usnCount, isGettingStaffUsns } = useGetStaffUsns(
    name,
    { computer_ids: [instance.id], limit: 1 },
    { enabled: hasTabCounts },
  );

  const [kernelStatus] =
    staffLivepatchInfo?.livepatch_info?.json?.output?.Status ?? [];
  const kernelCount = kernelStatus?.Livepatch?.Fixes?.length;

  const tabCounts: Record<
    string,
    { count?: number; isLoading: boolean; criticality?: "error" }
  > = {
    kernel: { count: kernelCount, isLoading: isGettingStaffLivepatchInfo },
    "security-issues": {
      count: usnCount,
      isLoading: isGettingStaffUsns,
      criticality: "error",
    },
    packages: {
      count: packageCount,
      isLoading: isGettingStaffInstancePackages,
    },
  };

  const getTabLabel = (id: string, label: string): ReactNode => {
    const tabCount = tabCounts[id];

    if (!tabCount || !hasTabCounts) {
      return label;
    }

    if (tabCount.isLoading) {
      return (
        <>
          <span>{label}</span>
          <LoadingState inline />
        </>
      );
    }

    if (tabCount.count) {
      return (
        <>
          <span>{label}</span>
          <Badge value={tabCount.count} criticality={tabCount.criticality} />
        </>
      );
    }

    return label;
  };

  const tabs = getSupportInstanceTabs(instance);
  const [firstTab] = tabs;
  // A tab the instance does not have (or no tab at all) shows the first one.
  const currentTab = tabs.find(({ id }) => id === tab) ?? firstTab;

  if (!currentTab) {
    return null;
  }

  const { Panel } = currentTab;

  return (
    <>
      <Tabs
        listClassName="u-no-margin--bottom"
        links={tabs.map(({ id, label }) => ({
          id: getTabLinkId(id),
          label: getTabLabel(id, label),
          role: "tab",
          active: id === currentTab.id,
          onClick: () => {
            setPageParams({ tab: id });
          },
        }))}
      />
      <div
        tabIndex={0}
        role="tabpanel"
        aria-labelledby={getTabLinkId(currentTab.id)}
        className={classes.tabPanel}
      >
        <AppErrorBoundary>
          <Suspense fallback={<LoadingState />}>
            <Panel key={currentTab.id} name={name} instance={instance} />
          </Suspense>
        </AppErrorBoundary>
      </div>
    </>
  );
};

export default SupportInstanceTabs;
