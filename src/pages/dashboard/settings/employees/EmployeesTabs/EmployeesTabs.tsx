import { FC, Suspense, useState } from "react";
import { Tabs } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import classes from "./EmployeesTabs.module.scss";
import EmployeesPanel from "../tabs/employees/EmployeesPanel";
import { AutoinstallFilesPanel } from "@/features/autoinstall-files";

const tabLinks = [
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
  const [currentTabLinkId, setCurrentTabLinkId] =
    useState("tab-link-employees");

  return (
    <>
      <Tabs
        listClassName="u-no-margin--bottom"
        links={tabLinks.map(({ label, id }) => ({
          label,
          id,
          role: "tab",
          active: id === currentTabLinkId,
          onClick: () => setCurrentTabLinkId(id),
        }))}
      />
      <div
        tabIndex={0}
        role="tabpanel"
        aria-labelledby={currentTabLinkId}
        className={classes.tabPanel}
      >
        <Suspense fallback={<LoadingState />}>
          {"tab-link-employees" === currentTabLinkId && <EmployeesPanel />}
          {"tab-link-autoinstall-files" === currentTabLinkId && (
            <AutoinstallFilesPanel />
          )}
        </Suspense>
      </div>
    </>
  );
};

export default EmployeesTabs;
