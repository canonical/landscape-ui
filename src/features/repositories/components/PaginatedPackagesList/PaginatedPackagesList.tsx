import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { ModalTablePagination } from "@/components/layout/TablePagination";
import { useMemo, type FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import type { CellProps, Column } from "react-table";
import type { AxiosError } from "axios";
import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";
import type { Package } from "../../types";

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
  const data = useMemo<Package[]>(
    () => packages.map((name) => ({ name })),
    [packages],
  );

  const columns = useMemo<Column<Package>[]>(
    () => [
      {
        Header: "Package name",
        meta: {
          ariaLabel: ({ original: { name } }) => `${name} package name`,
        },
        Cell: ({ row: { original } }: CellProps<Package>) => original.name,
      },
    ],
    [],
  );

  if (isGettingPackages) return <LoadingState />;
  if (error) throw error;

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
