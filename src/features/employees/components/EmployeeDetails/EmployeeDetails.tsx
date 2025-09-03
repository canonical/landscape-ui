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

      <InfoGrid spaced>
        <InfoGrid.Item label="Name" value={employee.name} />

        <InfoGrid.Item label="Email" value={employee.email} />

        <InfoGrid.Item label="Status" value={getStatusText(employee)} />
      </InfoGrid>

      <EmployeeInstancesTable instances={employee.computers} />
    </>
  );
};

export default EmployeeDetails;
