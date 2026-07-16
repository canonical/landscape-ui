import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { useMemo, type FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import type { CellProps, Column } from "react-table";
import type { AxiosError } from "axios";
import type { SourcePackage } from "../../types";
import { TokenBasedTablePagination } from "@/components/layout/TablePagination";

interface PaginatedPackagesListProps {
  readonly packages: string[];
  readonly packagesCount: number;
  readonly isPackagesCountExact: boolean;
  readonly isGettingPackages: boolean;
  readonly error: AxiosError | null;
  readonly emptyMsg: string;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
  readonly goToNextPage: () => void;
  readonly goToPreviousPage: () => void;
}

const PaginatedPackagesList: FC<PaginatedPackagesListProps> = ({
  packages,
  packagesCount,
  isPackagesCountExact,
  isGettingPackages,
  error,
  emptyMsg,
  hasPreviousPage,
  hasNextPage,
  goToNextPage,
  goToPreviousPage,
}) => {
  const data = useMemo<SourcePackage[]>(
    () => packages.map((name) => ({ name })),
    [packages],
  );

  const columns = useMemo<Column<SourcePackage>[]>(
    () => [
      {
        accessor: "name",
        Header: "Package name",
        Cell: ({ row: { original } }: CellProps<SourcePackage>) =>
          original.name,
      },
    ],
    [],
  );

  if (error) throw error;

  return (
    <>
      {isGettingPackages ? (
        <LoadingState />
      ) : (
        <ResponsiveTable
          columns={columns}
          data={data}
          emptyMsg={emptyMsg}
          minWidth={320}
        />
      )}
      <TokenBasedTablePagination
        currentItemCount={packages.length}
        totalItemCount={packagesCount}
        isTotalExact={isPackagesCountExact}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
        hasPreviousPage={hasPreviousPage}
        hasNextPage={hasNextPage}
        itemType="package"
      />
    </>
  );
};

export default PaginatedPackagesList;
