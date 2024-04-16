import { FC, lazy, Suspense, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Tabs } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import { Instance } from "@/types/Instance";
import { getTabLinks } from "./helpers";
import classes from "./SingleInstanceTabs.module.scss";

const InfoPanel = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/info"),
);
const ProcessesPanel = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/processes"),
);
const HardwarePanel = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/hardware"),
);
const PackagesPanel = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/packages"),
);
const ActivityPanel = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/activities"),
);
const InstancesPanel = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/instances"),
);
const UserPanel = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/users"),
);
const SecurityIssuesPanel = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/security-issues"),
);
const UbuntuProPanel = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/ubuntu-pro"),
);
const SnapsPanel = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/snaps"),
);

interface TabState {
  filter: string;
  selectAll: boolean;
}

interface SingleInstanceTabsProps {
  instance: Instance;
  packageCount: number | undefined;
  packagesLoading: boolean;
  usnCount: number | undefined;
  usnLoading: boolean;
}

const SingleInstanceTabs: FC<SingleInstanceTabsProps> = ({
  instance,
  packageCount,
  packagesLoading,
  usnCount,
  usnLoading,
}) => {
  const [currentTabLinkId, setCurrentTabLinkId] = useState("tab-link-info");
  const [tabState, setTabState] = useState<TabState | null>(null);

  const { state } = useLocation();

  useEffect(() => {
    if (!state) {
      return;
    }

    const { tab, ...otherProps } = state;

    if (tab) {
      setCurrentTabLinkId(`tab-link-${tab}`);
    }

    setTabState(otherProps);
  }, [state]);

  const tabLinks = getTabLinks({
    activeTabId: currentTabLinkId,
    instance,
    onActiveTabChange: (tabId) => {
      setCurrentTabLinkId(tabId);
      setTabState(null);
    },
    packageCount,
    packagesLoading,
    usnCount,
    usnLoading,
  });

  return (
    <>
      <Tabs listClassName="u-no-margin--bottom" links={tabLinks} />
      <div
        tabIndex={0}
        role="tabpanel"
        aria-labelledby={currentTabLinkId}
        className={classes.tabPanel}
      >
        <Suspense fallback={<LoadingState />}>
          {"tab-link-info" === currentTabLinkId && (
            <InfoPanel instance={instance} />
          )}
          {"tab-link-instances" === currentTabLinkId && (
            <InstancesPanel instance={instance} />
          )}
          {"tab-link-activities" === currentTabLinkId && (
            <ActivityPanel instanceId={instance.id} />
          )}
          {"tab-link-security-issues" === currentTabLinkId && (
            <SecurityIssuesPanel instance={instance} />
          )}
          {"tab-link-packages" === currentTabLinkId && (
            <PackagesPanel instance={instance} tabState={tabState} />
          )}
          {"tab-link-snaps" === currentTabLinkId && (
            <SnapsPanel instanceId={instance.id} />
          )}
          {"tab-link-processes" === currentTabLinkId && (
            <ProcessesPanel instanceId={instance.id} />
          )}
          {"tab-link-ubuntu-pro" === currentTabLinkId && (
            <UbuntuProPanel instance={instance} />
          )}
          {"tab-link-users" === currentTabLinkId && (
            <UserPanel instanceId={instance.id} />
          )}
          {"tab-link-hardware" === currentTabLinkId && (
            <HardwarePanel instance={instance} />
          )}
        </Suspense>
      </div>
    </>
  );
};

export default SingleInstanceTabs;
