import Menu from "@/components/layout/Menu";
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
      <Menu>
        <Menu.Row>
          <Menu.Row.Item label="Name" size={6} value={employee.name} />
          <Menu.Row.Item label="Email" size={6} value={employee.email} />
        </Menu.Row>

        <Menu.Row>
          <Menu.Row.Item
            label="Status"
            size={6}
            value={getStatusText(employee)}
          />
        </Menu.Row>

        <Menu.Row>
          <Menu.Row.Item
            label="Autoinstall file"
            size={12}
            value={
              employee.autoinstall_file
                ? `${employee.autoinstall_file.filename}, v${employee.autoinstall_file.version}`
                : null
            }
          />
        </Menu.Row>
      </Menu>

      <EmployeeInstancesTable instances={employee.computers} />
    </>
  );
};

export default EmployeeDetails;
