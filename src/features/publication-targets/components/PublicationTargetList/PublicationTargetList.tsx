import { LIST_ACTIONS_COLUMN_PROPS } from "@/components/layout/ListActions";
import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import type { FC, ReactElement } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { PublicationTargetWithPublications } from "../../types";
import PublicationTargetListActions from "../PublicationTargetListActions";

interface PublicationTargetListProps {
  readonly targets: PublicationTargetWithPublications[];
}

const getTargetType = (target: PublicationTargetWithPublications): string => {
  if (target.s3) return "S3";
  if (target.swift) return "Swift";
  return "Unknown";
};

const PublicationTargetList: FC<PublicationTargetListProps> = ({ targets }) => {
  const columns = useMemo<Column<PublicationTargetWithPublications>[]>(
    () => [
      {
        accessor: "displayName",
        id: "displayName",
        Header: "Name",
        Cell: ({ row }: CellProps<PublicationTargetWithPublications>) =>
          row.original.displayName || <NoData />,
      },
      {
        accessor: (row) => getTargetType(row),
        id: "type",
        Header: "Type",
      },
      {
        accessor: (row) => row.publications.length,
        id: "publications",
        Header: "Publications",
        Cell: ({ row }: CellProps<PublicationTargetWithPublications>) => {
          const { length } = row.original.publications;
          if (length === 0) return <NoData />;
          return (
            <span>
              {length} {length === 1 ? "publication" : "publications"}
            </span>
          );
        },
      },
      {
        ...LIST_ACTIONS_COLUMN_PROPS,
        Cell: ({ row: { original } }: CellProps<PublicationTargetWithPublications>): ReactElement => (
                  <PublicationTargetListActions target={original} />
                ),
      } as Column<PublicationTargetWithPublications>,
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
