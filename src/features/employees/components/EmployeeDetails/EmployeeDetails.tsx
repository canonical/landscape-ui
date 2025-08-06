import Grid from "@/components/layout/Grid";
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

      <Grid>
        <Grid.Item label="Name" size={6} value={employee.name} />

        <Grid.Item label="Email" size={6} value={employee.email} />

        <Grid.Item label="Status" size={6} value={getStatusText(employee)} />

        <Grid.Item
          label="Autoinstall file"
          size={12}
          value={
            employee.autoinstall_file
              ? `${employee.autoinstall_file.filename}, v${employee.autoinstall_file.version}`
              : null
          }
        />
      </Grid>

      <EmployeeInstancesTable instances={employee.computers} />
    </>
  );
};

export default EmployeeDetails;
