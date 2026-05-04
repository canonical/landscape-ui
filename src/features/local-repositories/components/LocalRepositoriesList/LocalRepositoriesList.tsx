import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { Button } from "@canonical/react-components";
import { useMemo, type FC } from "react";
import type { Column, CellProps } from "react-table";
import type { Local } from "@canonical/landscape-openapi";
import usePageParams from "@/hooks/usePageParams";
import { TablePagination } from "@/components/layout/TablePagination";
import LocalRepositoriesListActions from "./components/LocalRepositoriesListActions";
import LocalRepositoryPackagesCount from "./components/LocalRepositoryPackagesCount";
import LocalRepositoryPublicationsCount from "./components/LocalRepositoryPublicationsCount";

interface LocalRepositoriesListProps {
  readonly repositories: Local[];
}

const LocalRepositoriesList: FC<LocalRepositoriesListProps> = ({
  repositories,
}) => {
  const { search, currentPage, pageSize, createPageParamsSetter } =
    usePageParams();

  const pagedRepositories = useMemo(
    () =>
      repositories.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [repositories, currentPage, pageSize],
  );

  const columns = useMemo<Column<Local>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
        Cell: ({ row: { original: repository } }: CellProps<Local>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={createPageParamsSetter({
              sidePath: ["view"],
              name: repository.localId,
            })}
          >
            {repository.displayName}
          </Button>
        ),
      },
      {
        Header: "Description",
        Cell: ({ row: { original: repository } }: CellProps<Local>) =>
          repository.comment || <NoData />,
      },
      {
        Header: "Packages",
        Cell: ({ row: { original: repository } }: CellProps<Local>) => (
          <LocalRepositoryPackagesCount repository={repository} />
        ),
      },
      {
        Header: "Publications",
        Cell: ({ row: { original: repository } }: CellProps<Local>) => (
          <LocalRepositoryPublicationsCount repository={repository} />
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row: { original: repository } }: CellProps<Local>) => (
          <LocalRepositoriesListActions repository={repository} />
        ),
      },
    ],
    [createPageParamsSetter],
  );

  return (
    <>
      <ResponsiveTable
        columns={columns}
        data={pagedRepositories}
        emptyMsg={`No local repositories found with the search: "${search}"`}
      />
      <TablePagination
        totalItems={repositories.length}
        currentItemCount={pagedRepositories.length}
      />
    </>
  );
};

export default LocalRepositoriesList;
