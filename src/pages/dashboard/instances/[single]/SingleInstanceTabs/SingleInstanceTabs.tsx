import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";
import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import type { Instance, WindowsInstance } from "@/types/Instance";
import { Tabs } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { getTabLinks } from "./helpers";
import classes from "./SingleInstanceTabs.module.scss";

const InfoPanel = lazy(
  async () => import("@/pages/dashboard/instances/[single]/tabs/info"),
);
const ProcessesPanel = lazy(
  async () => import("@/pages/dashboard/instances/[single]/tabs/processes"),
);
const HardwarePanel = lazy(
  async () => import("@/pages/dashboard/instances/[single]/tabs/hardware"),
);
const PackagesPanel = lazy(
  async () => import("@/pages/dashboard/instances/[single]/tabs/packages"),
);
const ActivityPanel = lazy(
  async () => import("@/pages/dashboard/instances/[single]/tabs/activities"),
);
const KernelPanel = lazy(
  async () => import("@/pages/dashboard/instances/[single]/tabs/kernel"),
);
const WslPanel = lazy(
  async () => import("@/pages/dashboard/instances/[single]/tabs/wsl"),
);
const UserPanel = lazy(
  async () => import("@/pages/dashboard/instances/[single]/tabs/users"),
);
const SecurityIssuesPanel = lazy(
  async () =>
    import("@/pages/dashboard/instances/[single]/tabs/security-issues"),
);
const UbuntuProPanel = lazy(
  async () => import("@/pages/dashboard/instances/[single]/tabs/ubuntu-pro"),
);
const SnapsPanel = lazy(
  async () => import("@/pages/dashboard/instances/[single]/tabs/snaps"),
);

interface SingleInstanceTabsProps {
  readonly instance: Instance;
  readonly packageCount: number | undefined;
  readonly packagesLoading: boolean;
  readonly usnCount: number | undefined;
  readonly usnLoading: boolean;
  readonly kernelCount: number | undefined;
  readonly kernelLoading: boolean;
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
        <AppErrorBoundary>
          {"tab-link-info" === currentTabLinkId && (
            <Suspense fallback={<LoadingState />}>
              <InfoPanel instance={instance} />
            </Suspense>
          )}
          {"tab-link-wsl" === currentTabLinkId && (
            <Suspense fallback={<LoadingState />}>
              <WslPanel instance={instance as WindowsInstance} />
            </Suspense>
          )}
          {"tab-link-activities" === currentTabLinkId && (
            <Suspense fallback={<LoadingState />}>
              <ActivityPanel instanceId={instance.id} />
            </Suspense>
          )}
          {"tab-link-kernel" === currentTabLinkId && (
            <Suspense fallback={<LoadingState />}>
              <KernelPanel instanceTitle={instance.title} />
            </Suspense>
          )}
          {"tab-link-security-issues" === currentTabLinkId && (
            <Suspense fallback={<LoadingState />}>
              <SecurityIssuesPanel instance={instance} />
            </Suspense>
          )}
          {"tab-link-packages" === currentTabLinkId && (
            <Suspense fallback={<LoadingState />}>
              <PackagesPanel />
            </Suspense>
          )}
          {"tab-link-snaps" === currentTabLinkId && (
            <Suspense fallback={<LoadingState />}>
              <SnapsPanel />
            </Suspense>
          )}
          {"tab-link-processes" === currentTabLinkId && (
            <Suspense fallback={<LoadingState />}>
              <ProcessesPanel />
            </Suspense>
          )}
          {"tab-link-ubuntu-pro" === currentTabLinkId && (
            <Suspense fallback={<LoadingState />}>
              <UbuntuProPanel instance={instance} />
            </Suspense>
          )}
          {"tab-link-users" === currentTabLinkId && (
            <Suspense fallback={<LoadingState />}>
              <UserPanel />
            </Suspense>
          )}
          {"tab-link-hardware" === currentTabLinkId && (
            <Suspense fallback={<LoadingState />}>
              <HardwarePanel instance={instance} />
            </Suspense>
          )}
        </AppErrorBoundary>
      </div>
    </>
  );
};

export default SingleInstanceTabs;
