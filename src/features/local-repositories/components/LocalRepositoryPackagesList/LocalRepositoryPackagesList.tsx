import { useMemo, type FC } from "react";
import type { LocalRepository } from "../../types";
import { useGetRepositoryPackages } from "../../api";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import type { Column, CellProps } from "react-table";
import LoadingState from "@/components/layout/LoadingState";
import { Button, Icon, ICONS } from "@canonical/react-components";
import classes from "./LocalRepositoryPackagesList.module.scss";

interface LocalRepositoryPackagesListProps {
  readonly repository: LocalRepository;
  readonly packagesToDelete?: string[];
  readonly onPackageDelete?: (name: string) => void;
}

const LocalRepositoryPackagesList: FC<LocalRepositoryPackagesListProps> = ({
  repository,
  packagesToDelete,
  onPackageDelete,
}) => {
  const { result, isGettingRepositoryPackages } = useGetRepositoryPackages({
    repository: repository.name,
  });
  const packageNames = result?.local_packages ?? [];
  const packages = packageNames.map((name) => ({ name: name }));

  const columns = useMemo<Column<{ name: string }>[]>(() => {
    const columnArray: Column<{ name: string }>[] = [
      {
        Header: "Package name",
        meta: {
          ariaLabel: ({ original: { name } }) => `${name} package name`,
        },
        Cell: ({
          row: {
            original: { name },
          },
        }: CellProps<{ name: string }>) => (
          <span
            className={
              packagesToDelete?.includes(name) ? "u-text--muted" : undefined
            }
          >
            {name}
          </span>
        ),
      },
    ];

    if (onPackageDelete && packagesToDelete !== undefined) {
      columnArray.push({
        Header: "Remove",
        className: classes.actions,
        meta: {
          ariaLabel: ({ original: { name } }) => `Remove ${name} package`,
        },
        Cell: ({
          row: {
            original: { name },
          },
        }: CellProps<{ name: string }>) => (
          <Button
            onClick={() => {
              onPackageDelete(name);
            }}
            disabled={packagesToDelete.includes(name)}
            hasIcon
            appearance="base"
            className="u-no-margin--bottom"
            type="button"
          >
            <Icon name={ICONS.delete} />
          </Button>
        ),
      });
    }

    return columnArray;
  }, [packagesToDelete, onPackageDelete]);

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
