import EmptyState from "@/components/layout/EmptyState";
import NoData from "@/components/layout/NoData";
import {
  Link,
  type ModularTableProps,
  type TableHeader,
} from "@canonical/react-components";
import type { ComponentProps, FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column, HeaderGroup } from "react-table";
import usePageParams from "@/hooks/usePageParams";
import type { Fix } from "../../types";
import { EMPTY_TABLE_MESSAGE } from "./constants";
import { generateCveLink, handleCellProps } from "./helpers";
import classes from "./KernelTableList.module.scss";
import ResponsiveTable from "@/components/layout/ResponsiveTable";

interface KernelTableListProps {
  readonly kernelData: Fix[];
}

// ModularTable forwards these to TableHeader, though its type omits them.
type HeaderProps = ReturnType<
  NonNullable<ModularTableProps<Fix>["getHeaderProps"]>
> &
  Pick<ComponentProps<typeof TableHeader>, "sort" | "onSort">;

const KernelTableList: FC<KernelTableListProps> = ({ kernelData }) => {
  const { sort, sortBy, setPageParams } = usePageParams();
  const isDescending = sortBy === "Name" && sort === "desc";

  // kernelData is a single page; sorting happens on the full list upstream.
  const getHeaderProps = (column: HeaderGroup<Fix>): HeaderProps => {
    if (column.id !== "Name") {
      return {};
    }

    return {
      sort: isDescending ? "descending" : "ascending",
      onSort: () => {
        setPageParams({
          sortBy: "Name",
          sort: isDescending ? "asc" : "desc",
        });
      },
    };
  };

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
      },
      {
        Header: "Description",
        accessor: "Description",
        className: classes.description,
        Cell: ({ row }: CellProps<Fix>) =>
          row.original.Description || <NoData />,
      },
      {
        Header: "Bug",
        accessor: "Bug",
        Cell: ({ row }: CellProps<Fix>) => row.original.Bug || <NoData />,
      },
    ],
    [],
  );

  return (
    <>
      {kernelData.length === 0 ? (
        <EmptyState
          title="No outstanding kernel patches"
          body={EMPTY_TABLE_MESSAGE}
        />
      ) : (
        <>
          <h3 className="p-heading--5 u-no-padding u-no-margin">
            Patches discovered since last restart
          </h3>

          <ResponsiveTable
            columns={columns}
            data={kernelData}
            getCellProps={handleCellProps}
            getHeaderProps={getHeaderProps}
          />
        </>
      )}
    </>
  );
};

export default KernelTableList;
