import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import useSidePanel from "@/hooks/useSidePanel";
import { Tabs } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import classes from "./EmployeesTabs.module.scss";

const EmployeeGroupsPanel = lazy(
  async () => import("../tabs/employee-groups/EmployeeGroupsPanel"),
);
const EmployeesPanel = lazy(
  async () => import("../tabs/employees/EmployeesPanel"),
);
const AutoinstallFilesPanel = lazy(
  async () => import("../tabs/autoinstall-files/AutoinstallFilesPanel"),
);

const tabLinks = [
  {
    label: "Employee groups",
    id: "tab-link-employee-groups",
  },
  {
    label: "Employees",
    id: "tab-link-employees",
  },
  {
    label: "Autoinstall files",
    id: "tab-link-autoinstall-files",
  },
];

const EmployeesTabs: FC = () => {
  const { closeSidePanel } = useSidePanel();

  const { tab, setPageParams } = usePageParams();

  const currentTabLinkId = tab ? `tab-link-${tab}` : "tab-link-employee-groups";

  const onActiveTabChange = (tabId: string): void => {
    setPageParams({ tab: tabId.replace("tab-link-", "") });
  };

  return (
    <>
      <Tabs
        listClassName="u-no-margin--bottom"
        links={tabLinks.map(({ label, id }) => ({
          label,
          id,
          role: "tab",
          active: id === currentTabLinkId,
          onClick: () => {
            onActiveTabChange(id);
            closeSidePanel();
          },
        }))}
      />
      <div
        tabIndex={0}
        role="tabpanel"
        aria-labelledby={currentTabLinkId}
        className={classes.tabPanel}
      >
        {"tab-link-employee-groups" === currentTabLinkId && (
          <Suspense fallback={<LoadingState />}>
            <EmployeeGroupsPanel />
          </Suspense>
        )}
        {"tab-link-employees" === currentTabLinkId && (
          <Suspense fallback={<LoadingState />}>
            <EmployeesPanel />
          </Suspense>
        )}
        {"tab-link-autoinstall-files" === currentTabLinkId && (
          <Suspense fallback={<LoadingState />}>
            <AutoinstallFilesPanel />
          </Suspense>
        )}
      </div>
    </>
  );
};

export default EmployeesTabs;
