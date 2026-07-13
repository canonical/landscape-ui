import { useMemo, useState, type FC } from "react";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import type { CellProps, Column } from "react-table";
import { ModalTablePagination } from "@/components/layout/TablePagination";
import type { Package } from "@/features/repositories";
import { getCellProps } from "./helpers";
import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";

interface LocalRepositoryPackagesListProps {
  readonly packages: string[];
  readonly header?: string;
}

const LocalRepositoryPackagesList: FC<LocalRepositoryPackagesListProps> = ({
  packages,
  header = "Package name",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = DEFAULT_MODAL_PAGE_SIZE;

  const pagedPackages = useMemo<Package[]>(
    () =>
      packages
        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
        .map((name) => ({ name })),
    [packages, currentPage, pageSize],
  );

  const columns = useMemo<Column<Package>[]>(
    () => [
      {
        Header: header,
        meta: {
          ariaLabel: ({ original: { name } }) => `Package name: ${name}`,
        },
        Cell: ({ row: { original } }: CellProps<Package>) => original.name,
      },
    ],
    [header],
  );

  const maxPage = Math.ceil(packages.length / pageSize);

  return (
    <>
      <ResponsiveTable
        columns={columns}
        data={pagedPackages}
        getCellProps={getCellProps}
        emptyMsg={"No packages associated with this local repository."}
        minWidth={320}
      />
      <ModalTablePagination
        current={currentPage}
        max={maxPage}
        onPrev={() => {
          setCurrentPage((p) => Math.max(1, p - 1));
        }}
        onNext={() => {
          setCurrentPage((p) => Math.min(maxPage, p + 1));
        }}
      />
    </>
  );
};

export default LocalRepositoryPackagesList;
