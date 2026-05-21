import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import AdministratorRolesCell from "@/pages/dashboard/settings/administrators/tabs/administrators/AdministratorRolesCell";
import type { Administrator } from "@/types/Administrator";
import type { Role } from "@/types/Role";
import type { SelectOption } from "@/types/SelectOption";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo, useCallback } from "react";
import type { CellProps, Column } from "react-table";
import AdministratorListActions from "../AdministratorListActions";
import classes from "./AdministratorList.module.scss";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { handleCellProps } from "./helpers";
import usePageParams from "@/hooks/usePageParams";

interface AdministratorListProps {
  readonly administrators: Administrator[];
  readonly roles: Role[];
}

const AdministratorList: FC<AdministratorListProps> = ({
  administrators,
  roles,
}) => {
  const { search, sidePath, setPageParams } = usePageParams();
  const emptyMessage = search.trim()
    ? `No administrators found with the search: "${search.trim()}".`
    : "You have no administrators on your Landscape organization.";

  const administratorsData = useMemo(() => administrators, [administrators]);

  const roleOptions: SelectOption[] = useMemo(
    () =>
      roles.map(({ name }) => ({
        label: name,
        value: name,
      })),
    [roles],
  );

  const handleAdministratorClick = useCallback(
    (administrator: Administrator) => {
      setPageParams({
        sidePath: [...sidePath, "edit"],
        name: administrator.email,
      });
    },
    [setPageParams, sidePath],
  );

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
    [roleOptions, handleAdministratorClick],
  );

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
