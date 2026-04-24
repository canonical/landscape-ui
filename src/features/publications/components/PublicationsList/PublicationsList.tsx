import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions/constants";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import StaticLink from "@/components/layout/StaticLink";
import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { Publication } from "../../types";
import PublicationsListActions from "../PublicationsListActions";
import {
  getPublicationTargetName,
  getSourceName,
  getSourceType,
} from "../../helpers";

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
              publication: row.original.publicationId,
            })}
          >
            {row.original.label}
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
          <StaticLink to="/">
            {sourceDisplayNames[original.source] ??
              getSourceName(original.source)}
          </StaticLink>
        ),
      },
      {
        accessor: "publicationTarget",
        Header: "publication target",
        Cell: ({ row: { original } }: CellProps<Publication>) => (
          <StaticLink to="/">
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
    <ResponsiveTable
      columns={columns}
      data={publications}
      emptyMsg={`No publications found with the search: "${query}"`}
    />
  );
};

export default PublicationsList;
