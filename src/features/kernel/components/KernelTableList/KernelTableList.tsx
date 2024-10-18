import EmptyState from "@/components/layout/EmptyState";
import NoData from "@/components/layout/NoData";
import { Link, ModularTable } from "@canonical/react-components";
import {
  CellProps,
  Column,
} from "@canonical/react-components/node_modules/@types/react-table";
import { FC, useMemo } from "react";
import { Fix } from "../../types";
import { EMPTY_TABLE_MESSAGE } from "./constants";
import { generateCveLink, handleCellProps } from "./helpers";
import classes from "./KernelTableList.module.scss";

interface KernelTableListProps {
  kernelData: Fix[];
}

const KernelTableList: FC<KernelTableListProps> = ({ kernelData }) => {
  const columns = useMemo<Column<Fix>[]>(
    () => [
      {
        Header: <span>CVE</span>,
        accessor: "Name",
        Cell: ({ row }: CellProps<Fix>) => (
          <Link
            href={generateCveLink(row.original.Name)}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="u-no-margin--bottom u-no-padding--top"
          >
            {row.original.Name}
          </Link>
        ),
      },
      {
        Header: "Status",
        accessor: "Patched",
        Cell: ({ row: { original } }: CellProps<Fix>) =>
          original.Patched ? "Patched by Livepatch" : "Unpatched",
        getCellIcon: ({ row: { original } }: CellProps<Fix>) => {
          if (original.Patched) {
            return "status-succeeded-small";
          } else {
            return "status-failed-small";
          }
        },
        disableSortBy: true,
      },
      {
        Header: "Description",
        accessor: "Description",
        className: classes.description,
        Cell: ({ row }: CellProps<Fix>) =>
          row.original.Description || <NoData />,
        disableSortBy: true,
      },
      {
        Header: "Bug",
        accessor: "Bug",
        Cell: ({ row }: CellProps<Fix>) => row.original.Bug || <NoData />,
        disableSortBy: true,
      },
    ],
    [],
  );

  return (
    <>
      <h3 className="p-heading--5 u-no-padding u-no-margin">
        Patches discovered since last restart
      </h3>
      {kernelData.length === 0 ? (
        <EmptyState
          title="No outstanding kernel patches"
          body={EMPTY_TABLE_MESSAGE}
        />
      ) : (
        <ModularTable
          columns={columns}
          data={kernelData}
          getCellProps={handleCellProps}
          sortable
          initialSortColumn="Name"
          initialSortDirection="ascending"
        />
      )}
    </>
  );
};

export default KernelTableList;
