import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import StaticLink from "@/components/layout/StaticLink";
import { TableIcon } from "@/components/ui";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import date from "@/libs/date";
import { ROUTES } from "@/libs/routes";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { StaffAccountListItem } from "../../types";
import StaffAccountsListActions from "../StaffAccountsListActions";
import { getCellProps, getRowProps } from "./helpers";

interface StaffAccountsListProps {
  readonly staffAccounts: StaffAccountListItem[];
}

const StaffAccountsList: FC<StaffAccountsListProps> = ({ staffAccounts }) => {
  const columns = useMemo<Column<StaffAccountListItem>[]>(
    () => [
      {
        accessor: "account",
        Header: "Name",
        Cell: ({
          row: { original },
        }: CellProps<StaffAccountListItem>): ReactNode => (
          <StaticLink to={ROUTES.superAdmin.account(original.account)}>
            {original.account}
          </StaticLink>
        ),
      },
      {
        accessor: "company",
        Header: "Title",
      },
      {
        accessor: "subdomain",
        Header: "Subdomain",
        Cell: ({
          row: { original },
        }: CellProps<StaffAccountListItem>): ReactNode =>
          original.subdomain ?? <NoData />,
      },
      {
        accessor: "computers",
        Header: "Instances",
      },
      {
        id: "status",
        Header: "Status",
        Cell: ({
          row: { original },
        }: CellProps<StaffAccountListItem>): ReactNode =>
          original.disabled ? (
            <TableIcon icon="error" severity="danger">
              Disabled
            </TableIcon>
          ) : (
            <TableIcon icon="success" severity="positive">
              Active
            </TableIcon>
          ),
        // Reserves the icon gutter that `TableIcon` renders into.
        getCellIcon: () => false,
      },
      {
        accessor: "creation_time",
        Header: "Created",
        Cell: ({
          row: { original },
        }: CellProps<StaffAccountListItem>): ReactNode => (
          <span className="font-monospace">
            {date(original.creation_time).format(DISPLAY_DATE_TIME_FORMAT)}
          </span>
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({
          row: { original },
        }: CellProps<StaffAccountListItem>): ReactNode => (
          <StaffAccountsListActions staffAccount={original} />
        ),
      },
    ],
    [],
  );

  return (
    <ResponsiveTable
      columns={columns}
      data={staffAccounts}
      emptyMsg="No accounts found according to your search parameters."
      getCellProps={getCellProps}
      getRowProps={getRowProps}
    />
  );
};

export default StaffAccountsList;
