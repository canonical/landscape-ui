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
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import date from "@/libs/date";
import { ROUTES } from "@/libs/routes";
import { NO_DATA_TEXT } from "@/components/layout/NoData";
import { OperationStatusCell, OperationProvider } from "@/features/operations";
import classes from "./PublicationsList.module.scss";

interface PublicationsListProps {
  readonly publications: Publication[];
  readonly sourceDisplayNames: Record<string, string>;
  readonly publicationTargetDisplayNames: Record<string, string>;
}

const PublicationsList: FC<PublicationsListProps> = ({
  publications,
  sourceDisplayNames,
  publicationTargetDisplayNames,
}) => {
  const { query, createPageParamsSetter } = usePageParams();

  const operationNames = useMemo(
    () =>
      publications
        .map((publication) => publication.lastOperation)
        .filter((operationName): operationName is string => !!operationName),
    [publications],
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
        className: `${classes.status} p-table__cell--icon-placeholder`,
        Cell: ({ row: { original: publication } }: CellProps<Publication>) => (
          <OperationStatusCell
            operationName={publication.lastOperation}
            type="publication"
          />
        ),
      },
      {
        accessor: "publishTime",
        Header: "last published",
        className: classes.datetime,
        Cell: ({ row: { original } }: CellProps<Publication>) =>
          original.publishTime
            ? date(original.publishTime).format(DISPLAY_DATE_TIME_FORMAT)
            : NO_DATA_TEXT,
      },
      {
        id: "sourceType",
        accessor: "source",
        Header: "source type",
        className: classes.sourceType,
        Cell: ({ row: { original } }: CellProps<Publication>) => (
          <>{getSourceType(original.source)}</>
        ),
      },
      {
        accessor: "source",
        Header: "source",
        className: classes.source,
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
        className: classes.target,
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
    [createPageParamsSetter, sourceDisplayNames, publicationTargetDisplayNames],
  );

  return (
    <OperationProvider operationNames={operationNames}>
      <ResponsiveTable
        columns={columns}
        data={publications}
        emptyMsg={`No publications found with the search: "${query}"`}
        minWidth={1250}
      />
    </OperationProvider>
  );
};

export default PublicationsList;
