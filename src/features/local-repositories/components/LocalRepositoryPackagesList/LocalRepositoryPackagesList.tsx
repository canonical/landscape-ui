import { useMemo, useState, type FC } from "react";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import type { CellProps, Column, Row } from "react-table";
import { ModalTablePagination } from "@/components/layout/TablePagination";
import type { LocalPackage } from "../../types";
import { getCellProps } from "./helpers";

interface LocalRepositoryPackagesListProps {
  readonly packages: string[];
  readonly header?: string;
}

const LocalRepositoryPackagesList: FC<LocalRepositoryPackagesListProps> = ({
  packages,
  header = "Package name",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const formattedPackages = useMemo<LocalPackage[]>(
    () =>
      packages
        .map((name) => ({ name }))
        .toSorted((a, b) => a.name.localeCompare(b.name)),
    [packages],
  );
  const pagedPackages = useMemo(
    () =>
      formattedPackages.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize,
      ),
    [formattedPackages, currentPage, pageSize],
  );

  const columns = useMemo<Column<LocalPackage>[]>(
    () => [
      {
        Header: header,
        meta: {
          ariaLabel: (row: Row<LocalPackage>) =>
            `${header}: ${row.original.name}`,
        },
        Cell: ({
          row: {
            original: { name },
          },
        }: CellProps<LocalPackage>) => name,
      },
    ],
    [header],
  );

  const maxPage = Math.ceil(formattedPackages.length / pageSize);

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
