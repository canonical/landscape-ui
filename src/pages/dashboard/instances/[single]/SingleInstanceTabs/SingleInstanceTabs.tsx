import { FC, lazy, Suspense, useEffect, useState } from "react";
import { Instance } from "@/types/Instance";
import { useLocation, useParams } from "react-router-dom";
import { Tabs } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import classes from "./SingleInstanceTabs.module.scss";
import { TAB_LINKS } from "./constants";

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

interface TabState {
  filter: string;
  selectAll: boolean;
}

interface SingleInstanceTabsProps {
  instance: Instance;
}

const SingleInstanceTabs: FC<SingleInstanceTabsProps> = ({ instance }) => {
  const [currentTabLinkId, setCurrentTabLinkId] = useState("tab-link-info");
  const [tabState, setTabState] = useState<TabState | null>(null);

  const { childHostname } = useParams();
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

  return (
    <>
      <Tabs
        listClassName="u-no-margin--bottom"
        links={TAB_LINKS.filter(({ id }) =>
          instance.children.length > 0 && !childHostname
            ? [
                "tab-link-info",
                "tab-link-instances",
                "tab-link-activities",
                "tab-link-hardware",
              ].includes(id)
            : id !== "tab-link-instances",
        ).map(({ label, id }) => ({
          label,
          id,
          role: "tab",
          active: id === currentTabLinkId,
          onClick: () => {
            setCurrentTabLinkId(id);
            setTabState(null);
          },
        }))}
      />
      <div
        tabIndex={0}
        role="tabpanel"
        aria-labelledby={currentTabLinkId}
        className={classes.tabPanel}
      >
        <Suspense fallback={<LoadingState />}>
          {"tab-link-info" === currentTabLinkId && (
            <InfoPanel
              instance={
                instance.children.find(
                  ({ hostname }) => hostname === childHostname,
                ) ?? instance
              }
            />
          )}
          {"tab-link-instances" === currentTabLinkId && <InstancesPanel />}
          {"tab-link-activities" === currentTabLinkId && <ActivityPanel />}
          {"tab-link-security-issues" === currentTabLinkId && (
            <SecurityIssuesPanel instance={instance} />
          )}
          {"tab-link-packages" === currentTabLinkId && (
            <PackagesPanel tabState={tabState} />
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
          {"tab-link-hardware" === currentTabLinkId && <HardwarePanel />}
        </Suspense>
      </div>
    </>
  );
};

export default SingleInstanceTabs;
