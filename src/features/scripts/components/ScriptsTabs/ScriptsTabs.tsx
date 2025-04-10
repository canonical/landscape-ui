import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";
import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import classes from "@/pages/dashboard/instances/[single]/SingleInstanceTabs/SingleInstanceTabs.module.scss";
import { Tabs } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useGetScripts } from "../../api";

const ScriptsPanel = lazy(async () => import("../ScriptsContainer"));
const ScriptProfilesPanel = lazy(
  async () =>
    import("@/features/script-profiles/components/ScriptProfilesPanel"),
);

const tabs = [
  {
    label: "Scripts",
    id: "tab-link-scripts",
    role: "tab",
  },
  {
    label: "Profiles",
    id: "tab-link-profiles",
    role: "tab",
  },
];

const ScriptsTabs: FC = () => {
  const { tab, setPageParams } = usePageParams();

  const { scripts, scriptsCount, isScriptsLoading } = useGetScripts();

  const currentTab = tab ? `tab-link-${tab}` : tabs[0].id;

  return (
    <>
      <Tabs
        listClassName="u-no-margin--bottom"
        links={tabs.map((item) => ({
          ...item,
          active: item.id === currentTab,
          onClick: () => {
            setPageParams({ tab: item.id.replace("tab-link-", "") });
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
          <Suspense fallback={<LoadingState />}>
            {"tab-link-scripts" === currentTab && (
              <ScriptsPanel
                scripts={scripts}
                scriptsCount={scriptsCount}
                isScriptsLoading={isScriptsLoading}
              />
            )}
            {"tab-link-profiles" === currentTab && (
              <ScriptProfilesPanel
                hasScripts={!!scriptsCount}
                isGettingScripts={isScriptsLoading}
              />
            )}
          </Suspense>
        </AppErrorBoundary>
      </div>
    </>
  );
};

export default ScriptsTabs;
