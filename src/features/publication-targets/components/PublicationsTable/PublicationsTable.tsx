import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import { ModularTable } from "@canonical/react-components";
import type { FC, ReactNode } from "react";
import { useMemo, useState } from "react";
import type { CellProps, Column } from "react-table";
import type { Publication } from "../../types";

interface PublicationsTableProps {
  readonly publications: Publication[];
  readonly pageSize?: number;
}

const PublicationsTable: FC<PublicationsTableProps> = ({
  publications,
  pageSize,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const columns = useMemo<Column<Publication>[]>(
    () => [
      { accessor: "display_name", Header: "Publication" },
      {
        accessor: "mirror",
        Header: "Source",
        Cell: ({ value }: CellProps<Publication>): ReactNode =>
          (value as string | undefined) ?? "—",
      },
      {
        accessor: "distribution",
        Header: "Distribution",
        Cell: ({ value }: CellProps<Publication>): ReactNode =>
          (value as string | undefined) ?? "—",
      },
    ],
    [],
  );

  const pagedData =
    pageSize != null
      ? publications.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      : publications;

  return (
    <>
      <ModularTable columns={columns} data={pagedData} />
      {pageSize != null && publications.length > pageSize && (
        <SidePanelTablePagination
          currentPage={currentPage}
          pageSize={pageSize}
          paginate={setCurrentPage}
          setPageSize={() => undefined}
          totalItems={publications.length}
          currentItemCount={pagedData.length}
        />
      )}
    </>
  );
};

export default PublicationsTable;
