import { FC, lazy, Suspense } from "react";
import { Tabs } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import { Instance } from "@/types/Instance";
import useSidePanel from "@/hooks/useSidePanel";
import { getTabLinks } from "./helpers";
import classes from "./SingleInstanceTabs.module.scss";
import usePageParams from "@/hooks/usePageParams";

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
const KernelPanel = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/kernel"),
);
const WslPanel = lazy(
  () => import("@/pages/dashboard/instances/[single]/tabs/wsl"),
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

interface SingleInstanceTabsProps {
  instance: Instance;
  packageCount: number | undefined;
  packagesLoading: boolean;
  usnCount: number | undefined;
  usnLoading: boolean;
  kernelCount: number | undefined;
  kernelLoading: boolean;
}

const SingleInstanceTabs: FC<SingleInstanceTabsProps> = ({
  instance,
  packageCount,
  packagesLoading,
  usnCount,
  usnLoading,
  kernelCount,
  kernelLoading,
}) => {
  const { closeSidePanel } = useSidePanel();
  const { tab, setPageParams } = usePageParams();

  const currentTabLinkId = tab ? `tab-link-${tab}` : "tab-link-info";

  const tabLinks = getTabLinks({
    activeTabId: currentTabLinkId,
    instance,
    onActiveTabChange: (tabId) => {
      setPageParams({ tab: tabId.replace("tab-link-", "") });
      closeSidePanel();
    },
    packageCount,
    packagesLoading,
    usnCount,
    usnLoading,
    kernelCount,
    kernelLoading,
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
          {"tab-link-wsl" === currentTabLinkId && (
            <WslPanel instance={instance} />
          )}
          {"tab-link-activities" === currentTabLinkId && (
            <ActivityPanel instanceId={instance.id} />
          )}
          {"tab-link-kernel" === currentTabLinkId && (
            <KernelPanel instanceTitle={instance.title} />
          )}
          {"tab-link-security-issues" === currentTabLinkId && (
            <SecurityIssuesPanel instance={instance} />
          )}
          {"tab-link-packages" === currentTabLinkId && <PackagesPanel />}
          {"tab-link-snaps" === currentTabLinkId && <SnapsPanel />}
          {"tab-link-processes" === currentTabLinkId && <ProcessesPanel />}
          {"tab-link-ubuntu-pro" === currentTabLinkId && (
            <UbuntuProPanel instance={instance} />
          )}
          {"tab-link-users" === currentTabLinkId && <UserPanel />}
          {"tab-link-hardware" === currentTabLinkId && (
            <HardwarePanel instance={instance} />
          )}
        </Suspense>
      </div>
    </>
  );
};

export default SingleInstanceTabs;
