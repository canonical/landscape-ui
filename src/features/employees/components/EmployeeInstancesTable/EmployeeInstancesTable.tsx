import EmptyState from "@/components/layout/EmptyState";
import { getStatusCellIconAndLabel } from "@/features/instances";
import type { Instance } from "@/types/Instance";
import { ModularTable } from "@canonical/react-components";
import { useMemo, type FC } from "react";
import { Link } from "react-router";
import type { CellProps, Column } from "react-table";
import EmployeeInstancesTableContextualMenu from "../EmployeeInstancesTableContextualMenu";
import classes from "./EmployeeInstancesTable.module.scss";
import { handleCellProps } from "./helpers";
import { EMPTY_STATE } from "./constants";
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
          <Link
            className={classes.link}
            to={
              row.original.parent
                ? ROUTES.instancesChild({
                    instanceId: row.original.parent.id.toString(),
                    childInstanceId: row.original.id.toString(),
                  })
                : ROUTES.instancesSingle({
                    instanceId: row.original.id.toString(),
                  })
            }
          >
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
        Cell: () => "****************",
      },
      {
        accessor: "actions",
        className: classes.actions,
        Header: "actions",
        Cell: ({ row: { original } }: CellProps<Instance>) => (
          <EmployeeInstancesTableContextualMenu instance={original} />
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
