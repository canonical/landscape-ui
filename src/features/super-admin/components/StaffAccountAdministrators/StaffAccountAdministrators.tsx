import ResponsiveTable from "@/components/layout/ResponsiveTable";
import type { FC } from "react";
import { useMemo } from "react";
import type { Column } from "react-table";
import type { StaffAccountAdministrator } from "../../types";
import EmptyState from "@/components/layout/EmptyState";

const MIN_TABLE_WIDTH = 400;

interface StaffAccountAdministratorsProps {
  readonly administrators: StaffAccountAdministrator[];
}

const StaffAccountAdministrators: FC<StaffAccountAdministratorsProps> = ({
  administrators,
}) => {
  const columns = useMemo<Column<StaffAccountAdministrator>[]>(
    () => [
      { accessor: "name", Header: "Name" },
      { accessor: "email", Header: "Email" },
    ],
    [],
  );

  if (administrators.length === 0) {
    return (
      <EmptyState
        title="No administrators"
        icon="user-group"
        body="This account has no administrators."
      />
    );
  }

  return (
    <ResponsiveTable
      columns={columns}
      data={administrators}
      emptyMsg="This account has no administrators."
      minWidth={MIN_TABLE_WIDTH}
    />
  );
};

export default StaffAccountAdministrators;
