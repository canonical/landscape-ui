import type { FC } from "react";
import { lazy, Suspense } from "react";
import { Tabs } from "@canonical/react-components";
import type { Instance } from "@landscape/types";
import { useSidePanel } from "@landscape/context";
import { usePageParams } from "@landscape/hooks";
import { AppErrorBoundary, LoadingState } from "@landscape/ui";
import classes from "./SingleInstanceTabs.module.scss";
import { getTabLinks } from "./helpers";

const InfoPanel = lazy(
  async () => import("@/pages/instances/[single]/tabs/InfoPanel"),
);
const HardwarePanel = lazy(
  async () => import("@/pages/instances/[single]/tabs/HardwarePanel"),
);

interface SingleInstanceTabsProps {
  readonly instance: Instance;
}

const SingleInstanceTabs: FC<SingleInstanceTabsProps> = ({ instance }) => {
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
          <Suspense fallback={<LoadingState />}>
            {"tab-link-info" === currentTabLinkId && (
              <InfoPanel instance={instance} />
            )}
            {"tab-link-hardware" === currentTabLinkId && (
              <HardwarePanel instance={instance} />
            )}
          </Suspense>
        </AppErrorBoundary>
      </div>
    </>
  );
};

export default SingleInstanceTabs;
