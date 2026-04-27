import { useMemo, type FC } from "react";
import type { Local } from "@canonical/landscape-openapi";
import { useGetRepositoryPackages } from "../../../../api";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import type { Column, CellProps } from "react-table";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import usePageParams from "@/hooks/usePageParams";
import type { LocalPackage } from "../../../../types";

interface LocalRepositoryPackagesListProps {
  readonly repository: Local;
}

const LocalRepositoryPackagesList: FC<LocalRepositoryPackagesListProps> = ({
  repository,
}) => {
  const { currentPage, pageSize } = usePageParams();
  const { packages, isGettingRepositoryPackages } = useGetRepositoryPackages(
    repository.name ?? "",
  );

  const pagedPackages = useMemo(
    () => packages.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [packages, currentPage, pageSize],
  );

  const columns = useMemo<Column<LocalPackage>[]>(
    () => [
      {
        Header: "Package name",
        meta: {
          ariaLabel: ({ original: { name } }) => `${name} package name`,
        },
        Cell: ({
          row: {
            original: { name },
          },
        }: CellProps<LocalPackage>) => name,
      },
    ],
    [],
  );

  if (isGettingRepositoryPackages) {
    return <LoadingState />;
  }

  return (
    <>
      <ResponsiveTable
        columns={columns}
        data={pagedPackages}
        emptyMsg={"No packages associated with this local repository."}
        minWidth={320}
      />
      <TablePagination
        totalItems={packages.length}
        currentItemCount={pagedPackages.length}
      />
    </>
  );
};

export default LocalRepositoryPackagesList;
