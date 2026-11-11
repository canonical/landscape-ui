import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";
import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import { Tabs } from "@canonical/react-components";
import type { FC } from "react";
import { Suspense } from "react";
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
          label,
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
