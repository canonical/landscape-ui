import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";
import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import classes from "@/pages/dashboard/instances/[single]/SingleInstanceTabs/SingleInstanceTabs.module.scss";
import { Tabs } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { TABS } from "./constants";

const ScriptsPanel = lazy(async () => import("../ScriptsContainer"));
const ScriptProfilesPanel = lazy(
  async () =>
    import("@/features/script-profiles/components/ScriptProfilesPanel"),
);

const ScriptsTabs: FC = () => {
  const { tab, setPageParams } = usePageParams();
  const { closeSidePanel } = useSidePanel();

  const currentTab = tab ? `tab-link-${tab}` : TABS[0].id;

  return (
    <>
      <Tabs
        listClassName="u-no-margin--bottom"
        links={TABS.map((item) => ({
          ...item,
          active: item.id === currentTab,
          onClick: () => {
            setPageParams({ tab: item.id.replace("tab-link-", "") });
            closeSidePanel();
          },
        }))}
      />
      <div
        tabIndex={0}
        role="tabpanel"
        aria-labelledby={currentTab}
        className={classes.tabPanel}
      >
        <AppErrorBoundary>
          {"tab-link-scripts" === currentTab && (
            <Suspense fallback={<LoadingState />}>
              <ScriptsPanel />
            </Suspense>
          )}
          {"tab-link-profiles" === currentTab && (
            <Suspense fallback={<LoadingState />}>
              <ScriptProfilesPanel />
            </Suspense>
          )}
        </AppErrorBoundary>
      </div>
    </>
  );
};

export default ScriptsTabs;
