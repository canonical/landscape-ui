import InfoGrid from "@/components/layout/InfoGrid";
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

      <InfoGrid>
        <InfoGrid.Item label="Name" size={6} value={employee.name} />

        <InfoGrid.Item label="Email" size={6} value={employee.email} />

        <InfoGrid.Item
          label="Status"
          size={6}
          value={getStatusText(employee)}
        />

        <InfoGrid.Item
          label="Autoinstall file"
          size={12}
          value={
            employee.autoinstall_file
              ? `${employee.autoinstall_file.filename}, v${employee.autoinstall_file.version}`
              : null
          }
        />
      </InfoGrid>

      <EmployeeInstancesTable instances={employee.computers} />
    </>
  );
};

export default EmployeeDetails;
