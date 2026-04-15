import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import NoData, { NO_DATA_TEXT } from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import useSidePanel from "@/hooks/useSidePanel";
import useGetPublicationsByTarget from "../../api/useGetPublicationsByTarget";
import { Button, Icon } from "@canonical/react-components";
import type { FC, ReactElement } from "react";
import { lazy, Suspense, useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { PublicationTarget } from "@canonical/landscape-openapi";
import PublicationTargetListActions from "../PublicationTargetListActions";

const TargetDetails = lazy(async () => import("../TargetDetails/TargetDetails"));

interface PublicationTargetListProps {
  readonly targets: PublicationTarget[];
}

interface PublicationsCountCellProps {
  readonly publicationTargetId: string | undefined;
}

const PublicationsCountCell: FC<PublicationsCountCellProps> = ({
  publicationTargetId,
}) => {
  const { publications, isGettingPublications } =
    useGetPublicationsByTarget(publicationTargetId);

  if (isGettingPublications) {
    return <Icon name="spinner" className="u-animation--spin" aria-hidden />;
  }

  const { length } = publications;
  if (length === 0) return <NoData />;
  return (
    <span>
      {length} {length === 1 ? "publication" : "publications"}
    </span>
  );
};

const getTargetType = (target: PublicationTarget): string => {
  if (target.s3) return "S3";
  if (target.swift) return "Swift";
  return "Unknown";
};

const PublicationTargetList: FC<PublicationTargetListProps> = ({ targets }) => {
  const { setSidePanelContent } = useSidePanel();

  const columns = useMemo<Column<PublicationTarget>[]>(
    () => {
      const handleViewTargetDetails = (target: PublicationTarget): void => {
        setSidePanelContent(
          target.displayName ?? NO_DATA_TEXT,
          <Suspense fallback={null}>
            <TargetDetails target={target} />
          </Suspense>,
        );
      };

      return [
        {
          accessor: "displayName",
          id: "displayName",
          Header: "Name",
          Cell: ({ row }: CellProps<PublicationTarget>) => (
            <Button
              type="button"
              appearance="link"
              className="u-no-margin--bottom u-no-padding--top u-align-text--left"
              onClick={() => {
                handleViewTargetDetails(row.original);
              }}
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
        accessor: (row) => row.publicationTargetId,
        id: "publications",
        Header: "Publications",
        Cell: ({ row }: CellProps<PublicationTarget>): ReactElement => (
          <PublicationsCountCell
            publicationTargetId={row.original.publicationTargetId}
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
      ];
    },
    [setSidePanelContent],
  );

  return (
    <ResponsiveTable
      columns={columns as Column<Record<string, unknown>>[]}
      data={targets as unknown as Record<string, unknown>[]}
      minWidth={800}
    />
  );
};

export default PublicationTargetList;
