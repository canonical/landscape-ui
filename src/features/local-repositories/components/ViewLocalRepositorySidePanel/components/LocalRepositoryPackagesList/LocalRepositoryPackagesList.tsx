import { useMemo, type FC } from "react";
import type { LocalRepository } from "../../../../types";
import { useGetRepositoryPackages } from "../../../../api";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import type { Column, CellProps } from "react-table";
import LoadingState from "@/components/layout/LoadingState";

interface LocalRepositoryPackagesListProps {
  readonly repository: LocalRepository;
}

const LocalRepositoryPackagesList: FC<LocalRepositoryPackagesListProps> = ({
  repository,
}) => {
  const { result, isGettingRepositoryPackages } = useGetRepositoryPackages({
    repository: repository.name,
  });
  const packageNames = result?.local_packages ?? [];
  const packages = packageNames.map((name) => ({ name: name }));

  const columns = useMemo<Column<{ name: string }>[]>(() => [
    {
      Header: "Package name",
      meta: {
        ariaLabel: ({ original: { name } }) => `${name} package name`,
      },
      Cell: ({
        row: {
          original: { name },
        },
      }: CellProps<{ name: string }>) => name
    },
  ], []);

  if (isGettingRepositoryPackages) {
    return <LoadingState />;
  }

  return (
    <ResponsiveTable
      columns={columns}
      data={packages}
      emptyMsg={"No packages associated with this local repository."}
      minWidth={320}
    />
  );
};

export default LocalRepositoryPackagesList;
