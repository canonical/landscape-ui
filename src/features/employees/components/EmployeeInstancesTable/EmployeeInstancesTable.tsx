import EmptyState from "@/components/layout/EmptyState";
import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import {
  getStatusCellIconAndLabel,
  RecoveryKeyStatus,
} from "@/features/instances";
import type { Instance } from "@/types/Instance";
import { ModularTable } from "@canonical/react-components";
import { type FC, useMemo } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import EmployeeInstancesTableActions from "../EmployeeInstancesTableActions";
import { EMPTY_STATE } from "./constants";
import classes from "./EmployeeInstancesTable.module.scss";
import { handleCellProps } from "./helpers";
import { ROUTES } from "@/libs/routes";

interface EmployeeInstancesTableProps {
  readonly instances: Instance[] | null;
}

const EmployeeInstancesTable: FC<EmployeeInstancesTableProps> = ({
  instances,
}) => {
  const columns = useMemo<Column<Instance>[]>(
    () => [
      {
        accessor: "name",
        Header: "name",
        Cell: ({ row }: CellProps<Instance>) => (
          <Link to={ROUTES.instances.details.fromInstance(row.original)}>
            {row.original.title}
          </Link>
        ),
      },

      {
        accessor: "status",
        Header: "status",
        Cell: ({ row: { original } }: CellProps<Instance>) => {
          const { label } = getStatusCellIconAndLabel(original);
          return label;
        },
        getCellIcon: ({ row: { original } }: CellProps<Instance>) => {
          const { icon } = getStatusCellIconAndLabel(original);
          return icon;
        },
      },
      {
        accessor: "recovery_key",
        Header: "recovery key",
        Cell: ({ row: { original } }: CellProps<Instance>) => (
          <RecoveryKeyStatus instanceId={original.id} />
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row: { original } }: CellProps<Instance>) => (
          <EmployeeInstancesTableActions instance={original} />
        ),
      },
    ],
    [instances],
  );

  return (
    <div className={classes.container}>
      <h4 className="p-heading--5">Instances associated</h4>

      {instances && instances.length > 0 ? (
        <ModularTable
          data={instances}
          columns={columns}
          getCellProps={handleCellProps()}
        />
      ) : (
        <EmptyState title={EMPTY_STATE.title} body={EMPTY_STATE.body} />
      )}
    </div>
  );
};

export default EmployeeInstancesTable;
