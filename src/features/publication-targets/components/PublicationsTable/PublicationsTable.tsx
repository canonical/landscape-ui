import ModalTablePagination from "@/components/layout/TablePagination/components/ModalTablePagination/ModalTablePagination";
import { ModularTable } from "@canonical/react-components";
import type { FC, ReactNode } from "react";
import { useMemo, useState } from "react";
import type { CellProps, Column } from "react-table";
import type { Publication } from "@canonical/landscape-openapi";
import PublicationLink from "./PublicationLink/PublicationLink";
import MirrorLink from "./MirrorLink/MirrorLink";

interface PublicationsTableProps {
  readonly publications: Publication[];
  readonly pageSize?: number;
  readonly openInNewTab?: boolean;
}

const PublicationsTable: FC<PublicationsTableProps> = ({
  publications,
  pageSize=10,
  openInNewTab=false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // TODO: replace label with displayName once it's available in the API, link mirror to /mirrors with sidebar open
  const columns = useMemo<Column<Publication>[]>(
    () => [
      {
        accessor: "label",
        Header: "Publication",
        Cell: ({ row }: CellProps<Publication>): ReactNode => (
          <PublicationLink publication={row.original} openInNewTab={openInNewTab} />
        ),
      },
      {
        accessor: "source",
        Header: "Source",
        Cell: ({ row }: CellProps<Publication>): ReactNode => (
          <MirrorLink mirrorName={row.original.source ?? row.original.mirror} openInNewTab={openInNewTab} />
        ),
      }
    ],
    [openInNewTab],
  );

  const pagedData =
    pageSize != null
      ? publications.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      : publications;

  const maxPage = pageSize != null ? Math.ceil(publications.length / pageSize) : 1;

  return (
    <>
      <ModularTable
        columns={columns as Column<Record<string, unknown>>[]}
        data={pagedData as unknown as Record<string, unknown>[]}
      />
      <ModalTablePagination
        current={currentPage}
        max={maxPage}
        onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNext={() => setCurrentPage((p) => Math.min(maxPage, p + 1))}
      />
    </>
  );
};

export default PublicationsTable;
