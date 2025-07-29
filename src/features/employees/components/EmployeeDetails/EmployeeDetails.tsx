import Menu from "@/components/layout/Menu";
import NoData from "@/components/layout/NoData";
import type { FC } from "react";
import { getStatusText } from "../../helpers";
import type { Employee } from "../../types";
import EmployeeDetailsHeader from "../EmployeeDetailsHeader";
import EmployeeInstancesTable from "../EmployeeInstancesTable";

interface EmployeeDetailsProps {
  readonly employee: Employee;
}

const EmployeeDetails: FC<EmployeeDetailsProps> = ({ employee }) => {
  return (
    <>
      <EmployeeDetailsHeader employee={employee} />
      <Menu
        items={[
          { label: "Name", size: 6, value: employee.name },
          { label: "Email", size: 6, value: employee.email },
          { label: "Status", size: 6, value: getStatusText(employee) },
          {
            label: "Autoinstall file",
            size: 12,
            value: employee.autoinstall_file ? (
              `${employee.autoinstall_file.filename}, v${employee.autoinstall_file.version}`
            ) : (
              <NoData />
            ),
          },
        ]}
      />

      <EmployeeInstancesTable instances={employee.computers} />
    </>
  );
};

export default EmployeeDetails;
