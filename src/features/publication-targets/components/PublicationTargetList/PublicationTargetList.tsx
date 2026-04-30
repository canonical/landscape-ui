import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import NoData, { NO_DATA_TEXT } from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { TablePagination } from "@/components/layout/TablePagination";
import usePageParams from "@/hooks/usePageParams";
import useGetPublicationsByTarget from "../../api/useGetPublicationsByTarget";
import { Button } from "@canonical/react-components";
import type { FC, ReactElement } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { PublicationTarget } from "@canonical/landscape-openapi";
import PublicationTargetListActions from "../PublicationTargetListActions";
import StaticLink from "@/components/layout/StaticLink";
import { ROUTES } from "@/libs/routes";
import { pluralizeNew } from "@/utils/_helpers";
import LoadingState from "@/components/layout/LoadingState";

interface PublicationTargetListProps {
  readonly targets: PublicationTarget[];
}

interface PublicationsCountCellProps {
  readonly publicationTargetId: string;
}

const PublicationsCountCell: FC<PublicationsCountCellProps> = ({
  publicationTargetId,
}) => {
  const { publications, isGettingPublications } =
    useGetPublicationsByTarget(publicationTargetId);

  if (isGettingPublications) {
    return <LoadingState inline />;
  }

  const { length } = publications;
  if (length === 0) return <NoData />;
  return (
    <StaticLink
      to={{
        pathname: ROUTES.repositories.publications(),
        search: `?query=${encodeURIComponent(`publicationTargetId:${publicationTargetId}`)}`,
      }}
    >
      {pluralizeNew(publications.length, "publication", {
        showCount: "exact",
      })}
    </StaticLink>
  );
};

const getTargetType = (target: PublicationTarget): string => {
  if (target.s3) return "S3";
  if (target.swift) return "Swift";
  if (target.filesystem) return "Filesystem";
  return "Unknown";
};

const PublicationTargetList: FC<PublicationTargetListProps> = ({ targets }) => {
  const { search, currentPage, pageSize, createPageParamsSetter } =
    usePageParams();

  const pagedTargets = useMemo(
    () => targets.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [targets, currentPage, pageSize],
  );

  const columns = useMemo<Column<PublicationTarget>[]>(
    () => [
      {
        accessor: "displayName",
        id: "displayName",
        Header: "Name",
        Cell: ({ row }: CellProps<PublicationTarget>) => (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin--bottom u-no-padding--top u-align-text--left"
            onClick={createPageParamsSetter({
              sidePath: ["view"],
              name: row.original.publicationTargetId ?? "",
            })}
            aria-label={`View details for ${row.original.displayName}`}
          >
            {row.original.displayName || NO_DATA_TEXT}
          </Button>
        ),
      },
      {
        accessor: (row) => getTargetType(row),
        id: "type",
        Header: "Type",
      },
      {
        accessor: "publicationTargetId",
        id: "publications",
        Header: "Publications",
        Cell: ({ row }: CellProps<PublicationTarget>): ReactElement => (
          <PublicationsCountCell
            publicationTargetId={row.original.publicationTargetId ?? ""}
          />
        ),
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({
          row: { original },
        }: CellProps<PublicationTarget>): ReactElement => (
          <PublicationTargetListActions target={original} />
        ),
      } as Column<PublicationTarget>,
    ],
    [createPageParamsSetter],
  );

  return (
    <>
      <ResponsiveTable
        columns={columns as Column<Record<string, unknown>>[]}
        data={pagedTargets as unknown as Record<string, unknown>[]}
        minWidth={800}
        emptyMsg={`No publication targets found with the search: "${search}"`}
      />
      <TablePagination
        totalItems={targets.length}
        currentItemCount={pagedTargets.length}
      />
    </>
  );
};

export default PublicationTargetList;
