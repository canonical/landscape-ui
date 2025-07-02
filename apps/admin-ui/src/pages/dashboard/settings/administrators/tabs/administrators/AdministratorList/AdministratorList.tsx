import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import useSidePanel from "@/hooks/useSidePanel";
import AdministratorRolesCell from "@/pages/dashboard/settings/administrators/tabs/administrators/AdministratorRolesCell";
import EditAdministratorForm from "@/pages/dashboard/settings/administrators/tabs/administrators/EditAdministratorForm";
import type { Administrator } from "@/types/Administrator";
import type { Role } from "@/types/Role";
import type { SelectOption } from "@/types/SelectOption";
import { Button } from "@canonical/react-components";
import type { FC, HTMLProps } from "react";
import { useMemo } from "react";
import type { Cell, CellProps, Column, TableCellProps } from "react-table";
import AdministratorListActions from "../AdministratorListActions";
import classes from "./AdministratorList.module.scss";
import ResponsiveTable from "@/components/layout/ResponsiveTable";

interface AdministratorListProps {
  readonly administrators: Administrator[];
  readonly emptyMessage: string;
  readonly roles: Role[];
}

const AdministratorList: FC<AdministratorListProps> = ({
  administrators,
  emptyMessage,
  roles,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const administratorsData = useMemo(() => administrators, [administrators]);

  const roleOptions: SelectOption[] = useMemo(
    () =>
      roles.map(({ name }) => ({
        label: name,
        value: name,
      })),
    [roles],
  );

  const handleAdministratorClick = (administrator: Administrator) => {
    setSidePanelContent(
      administrator.name,
      <EditAdministratorForm administrator={administrator} />,
    );
  };

  const columns = useMemo<Column<Administrator>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
        Cell: ({ row }: CellProps<Administrator>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top"
            onClick={() => {
              handleAdministratorClick(row.original);
            }}
          >
            {row.original.name}
          </Button>
        ),
      },
      {
        accessor: "email",
        Header: "Email",
      },
      {
        accessor: "roles",
        className: classes.roles,
        Header: "Roles",
        Cell: ({ row }: CellProps<Administrator>) => (
          <AdministratorRolesCell
            administrator={row.original}
            roleOptions={roleOptions}
          />
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row }: CellProps<Administrator>) => (
          <AdministratorListActions administrator={row.original} />
        ),
      },
    ],
    [administratorsData, roleOptions],
  );

  const handleCellProps = (cell: Cell<Administrator>) => {
    const cellProps: Partial<TableCellProps & HTMLProps<HTMLTableCellElement>> =
      {};

    if (cell.column.id === "name") {
      cellProps.role = "rowheader";
    } else if (cell.column.id === "email") {
      cellProps["aria-label"] = "Email";
    } else if (cell.column.id === "roles") {
      cellProps["aria-label"] = "Roles";
    } else if (cell.column.id === "actions") {
      cellProps["aria-label"] = "Actions";
    }

    return cellProps;
  };

  return (
    <ResponsiveTable
      columns={columns}
      data={administratorsData}
      getCellProps={handleCellProps}
      emptyMsg={emptyMessage}
      className={classes.table}
    />
  );
};

export default AdministratorList;
