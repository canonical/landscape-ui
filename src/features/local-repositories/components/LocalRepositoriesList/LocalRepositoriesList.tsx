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
import LocalRepositoryPublicationsCount from "./components/LocalRepositoryPublicationsCount";
import {
  getOperationStatusIcon,
  OperationStatusCell,
  useBatchGetOperations,
} from "@/features/operations";
import { DEFAULT_POLLING_INTERVAL, DISPLAY_DATE_TIME_FORMAT } from "@/constants";
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

  const operationNames = pagedRepositories
    .filter((repository) => repository.lastOperation)
    .map((repository) => repository.lastOperation ?? "");

  const { operations, isGettingOperations } = useBatchGetOperations(
    operationNames,
    {
      refetchInterval: ({ state }) =>
        Object.values(state.data ?? {}).some((operation) => !operation.done)
          ? DEFAULT_POLLING_INTERVAL
          : false,
    },
  );

  const columns = useMemo<Column<Local>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
        className: classes.name,
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
        Header: "status",
        className: classes.status,
        Cell: ({ row: { original: repository } }: CellProps<Local>) => {
          const operation = operations[repository.lastOperation ?? ""];
          return (
            <OperationStatusCell
              isGettingOperation={isGettingOperations}
              operationMetadata={operation?.metadata}
              type="local"
            />
          );
        },
        getCellIcon: ({ row: { original: repository } }: CellProps<Local>) => {
          // eslint-disable-next-line react/prop-types
          const operation = operations[repository.lastOperation ?? ""];
          return getOperationStatusIcon(operation?.metadata.status);
        },
      },
      {
        Header: "Last import",
        className: "medium-cell",
        Cell: ({ row: { original } }: CellProps<Local>) =>
          original.lastImportTime
            ? moment(original.lastImportTime).format(DISPLAY_DATE_TIME_FORMAT)
            : NO_DATA_TEXT,
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
        Cell: ({ row: { original: repository } }: CellProps<Local>) => {
          const operation = operations[repository.lastOperation ?? ""];
          return <LocalRepositoriesListActions
            repository={repository}
            inProgress={!!operation && !operation.done}
          />;
        },
      },
    ],
    [createPageParamsSetter, isGettingOperations, operations],
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
