import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { TablePagination } from "@/components/layout/TablePagination";
import { Button } from "@canonical/react-components";
import { useMemo, type FC } from "react";
import type { Column, CellProps } from "react-table";
import type { Local } from "@canonical/landscape-openapi";
import usePageParams from "@/hooks/usePageParams";
import LocalRepositoriesListActions from "./components/LocalRepositoriesListActions";
import LocalRepositoryPackagesCount from "./components/LocalRepositoryPackagesCount";
import { AssociatedPublicationsCount } from "@/features/publications";
import { OperationStatusCell, OperationProvider } from "@/features/operations";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import classes from "./LocalRepositoriesList.module.scss";
import moment from "moment";
import { NO_DATA_TEXT } from "@/components/layout/NoData";

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

  const operationNames = useMemo(
    () =>
      pagedRepositories
        .map((repository) => repository.lastOperation)
        .filter((operationName): operationName is string => !!operationName),
    [pagedRepositories],
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
        Header: "Status",
        className: `${classes.status} p-table__cell--icon-placeholder`,
        Cell: ({ row: { original: repository } }: CellProps<Local>) => (
          <OperationStatusCell
            operationName={repository.lastOperation}
            type="local"
          />
        ),
      },
      {
        Header: "Last import",
        className: classes.datetime,
        Cell: ({ row: { original } }: CellProps<Local>) =>
          original.lastImportTime
            ? moment(original.lastImportTime).format(DISPLAY_DATE_TIME_FORMAT)
            : NO_DATA_TEXT,
      },
      {
        Header: "Packages",
        className: classes.count,
        Cell: ({ row: { original: repository } }: CellProps<Local>) => (
          <LocalRepositoryPackagesCount repository={repository.name ?? ""} />
        ),
      },
      {
        Header: "Publications",
        className: classes.count,
        Cell: ({ row: { original: repository } }: CellProps<Local>) => (
          <AssociatedPublicationsCount sourceName={repository.name ?? ""} />
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
    <OperationProvider operationNames={operationNames}>
      <ResponsiveTable
        columns={columns}
        data={pagedRepositories}
        emptyMsg={`No local repositories found with the search: "${search}"`}
        minWidth={980}
      />
      <TablePagination
        totalItems={repositories.length}
        currentItemCount={pagedRepositories.length}
      />
    </OperationProvider>
  );
};

export default LocalRepositoriesList;
