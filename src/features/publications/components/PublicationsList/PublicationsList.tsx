import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions/constants";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import StaticLink from "@/components/layout/StaticLink";
import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import PublicationsListActions from "../PublicationsListActions";
import {
  getPublicationTargetName,
  getSourceName,
  getSourceType,
} from "../../helpers";
import type { Publication } from "@canonical/landscape-openapi";
import {
  DEFAULT_POLLING_INTERVAL,
  DISPLAY_DATE_TIME_FORMAT,
} from "@/constants";
import moment from "moment";
import { ROUTES } from "@/libs/routes";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import {
  getOperationStatusIcon,
  OperationStatusCell,
  useBatchGetOperations,
} from "@/features/operations";
import classes from "./PublicationsList.module.scss";

interface PublicationsListProps {
  readonly publications: Publication[];
  readonly sourceDisplayNames?: Record<string, string>;
  readonly publicationTargetDisplayNames?: Record<string, string>;
}

const PublicationsList: FC<PublicationsListProps> = ({
  publications,
  sourceDisplayNames = {},
  publicationTargetDisplayNames = {},
}) => {
  const { query, createPageParamsSetter } = usePageParams();

  const operationNames = publications
    .filter((publication) => publication.lastOperation)
    .map((publication) => publication.lastOperation ?? "");

  const { operations: operations, isGettingOperations } = useBatchGetOperations(
    operationNames,
    {
      refetchInterval: ({ state }) =>
        Object.values(state.data ?? {}).some((operation) => !operation.done)
          ? DEFAULT_POLLING_INTERVAL
          : false,
    },
  );

  const columns = useMemo<Column<Publication>[]>(
    () => [
      {
        accessor: "name",
        Header: "name",
        Cell: ({ row }: CellProps<Publication>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={createPageParamsSetter({
              sidePath: ["view"],
              name: row.original.publicationId,
            })}
          >
            {row.original.displayName}
          </Button>
        ),
      },
      {
        Header: "status",
        className: classes.status,
        Cell: ({ row: { original: publication } }: CellProps<Publication>) => {
          const operation = operations[publication.lastOperation ?? ""];
          return (
            <OperationStatusCell
              isGettingOperation={isGettingOperations}
              operation={operation}
              type="publication"
            />
          );
        },
        getCellIcon: ({
          row: { original: publication },
        }: CellProps<Publication>) => {
          const operation = operations[publication.lastOperation ?? ""];
          return getOperationStatusIcon(operation);
        },
      },
      {
        accessor: "publishTime",
        Header: "last published",
        className: "medium-cell",
        Cell: ({ row: { original } }: CellProps<Publication>) =>
          original.publishTime
            ? moment(original.publishTime).format(DISPLAY_DATE_TIME_FORMAT)
            : NO_DATA_TEXT,
      },
      {
        id: "sourceType",
        accessor: "source",
        Header: "source type",
        Cell: ({ row: { original } }: CellProps<Publication>) => (
          <>{getSourceType(original.source)}</>
        ),
      },
      {
        accessor: "source",
        Header: "source",
        Cell: ({ row: { original } }: CellProps<Publication>) => (
          <StaticLink
            to={
              getSourceType(original.source) === "Mirror"
                ? ROUTES.repositories.mirrors({
                    sidePath: ["view"],
                    name: original.source,
                  })
                : ROUTES.repositories.localRepositories({
                    sidePath: ["view"],
                    name: original.source.replace(/^locals\//, ""),
                  })
            }
          >
            {sourceDisplayNames[original.source] ??
              getSourceName(original.source)}
          </StaticLink>
        ),
      },
      {
        accessor: "publicationTarget",
        Header: "publication target",
        Cell: ({ row: { original } }: CellProps<Publication>) => (
          <StaticLink
            to={ROUTES.repositories.publicationTargets({
              sidePath: ["view"],
              name: original.publicationTarget.replace(
                /^publicationTargets\//,
                "",
              ),
            })}
          >
            {publicationTargetDisplayNames[original.publicationTarget] ??
              getPublicationTargetName(original.publicationTarget)}
          </StaticLink>
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row: { original } }: CellProps<Publication>) => (
          <PublicationsListActions publication={original} />
        ),
      },
    ],
    [
      createPageParamsSetter,
      operations,
      isGettingOperations,
      sourceDisplayNames,
      publicationTargetDisplayNames,
    ],
  );

  return (
    <ResponsiveTable
      columns={columns}
      data={publications}
      emptyMsg={`No publications found with the search: "${query}"`}
      minWidth={1250}
    />
  );
};

export default PublicationsList;
