import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import useGetPublicationsByTarget from "../../api/useGetPublicationsByTarget";
import { Icon } from "@canonical/react-components";
import type { FC, ReactElement } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { PublicationTarget } from "../../types";
import PublicationTargetListActions from "../PublicationTargetListActions";

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
  const columns = useMemo<Column<PublicationTarget>[]>(
    () => [
      {
        accessor: "displayName",
        id: "displayName",
        Header: "Name",
        Cell: ({ row }: CellProps<PublicationTarget>) =>
          row.original.displayName || <NoData />,
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
    ],
    [],
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
