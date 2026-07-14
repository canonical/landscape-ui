import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { ModalTablePagination } from "@/components/layout/TablePagination";
import { useMemo, type FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import type { CellProps, Column } from "react-table";
import type { AxiosError } from "axios";
import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";
import type { SourcePackage } from "../../types";

interface PaginatedPackagesListProps {
  readonly packages: string[];
  readonly isPackagesCountExact: boolean;
  readonly packagesCount: number;
  readonly isGettingPackages: boolean;
  readonly error: AxiosError | null;
  readonly emptyMsg: string;
  readonly currentPage: number;
  readonly hasNextPage: boolean;
  readonly onNextPage: () => void;
  readonly onPreviousPage: () => void;
}

const PaginatedPackagesList: FC<PaginatedPackagesListProps> = ({
  packages,
  packagesCount,
  isPackagesCountExact,
  isGettingPackages,
  error,
  emptyMsg,
  currentPage,
  hasNextPage,
  onNextPage,
  onPreviousPage,
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
  if (isGettingPackages) return <LoadingState />;

  const maxPages = Math.max(
    currentPage,
    Math.ceil(packagesCount / DEFAULT_MODAL_PAGE_SIZE),
  );

  return (
    <>
      <ResponsiveTable
        columns={columns}
        data={data}
        emptyMsg={emptyMsg}
        minWidth={320}
      />
      <ModalTablePagination
        current={currentPage}
        max={maxPages}
        isExact={hasNextPage ? isPackagesCountExact : true}
        onNext={onNextPage}
        onPrev={onPreviousPage}
      />
    </>
  );
};

export default PaginatedPackagesList;
