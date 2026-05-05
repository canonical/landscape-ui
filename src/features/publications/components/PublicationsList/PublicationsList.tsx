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
import moment from "moment";
import { ROUTES } from "@/libs/routes";
import { NO_DATA_TEXT } from "@/components/layout/NoData/constants";

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
                    search: sourceDisplayNames[original.source],
                  })
                : ROUTES.repositories.localRepositories({
                    search: sourceDisplayNames[original.source],
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
              search: publicationTargetDisplayNames[original.publicationTarget],
            })}
          >
            {publicationTargetDisplayNames[original.publicationTarget] ??
              getPublicationTargetName(original.publicationTarget)}
          </StaticLink>
        ),
      },
      {
        accessor: "publishTime",
        Header: "Date published",
        Cell: ({ row: { original } }: CellProps<Publication>) =>
          original.publishTime
            ? moment(original.publishTime).format(DISPLAY_DATE_TIME_FORMAT)
            : NO_DATA_TEXT,
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
    <ResponsiveTable
      columns={columns}
      data={publications}
      emptyMsg={`No publications found with the search: "${query}"`}
    />
  );
};

export default PublicationsList;
