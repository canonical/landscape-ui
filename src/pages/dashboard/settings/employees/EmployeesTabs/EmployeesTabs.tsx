import AppTabs from "@/components/AppTabs";
import type { FC } from "react";
import { lazy } from "react";

const EmployeesPanel = lazy(
  async () => import("../tabs/employees/EmployeesPanel"),
);
const AutoinstallFilesPanel = lazy(
  async () => import("../tabs/autoinstall-files/AutoinstallFilesPanel"),
);

const EmployeesTabs: FC = () => (
  <AppTabs
    aria-label="Employees"
    items={[
      { id: "employees", label: "Employees", panel: <EmployeesPanel /> },
      {
        id: "autoinstall-files",
        label: "Autoinstall files",
        panel: <AutoinstallFilesPanel />,
      },
    ]}
  />
);

export default EmployeesTabs;
