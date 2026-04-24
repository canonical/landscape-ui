import type { CellProps, Column } from "react-table";
import { useMemo, type FC } from "react";
import type { Publication } from "@canonical/landscape-openapi";
import { ModularTable } from "@canonical/react-components";
import { ModalTablePagination } from "@/components/layout/TablePagination";
import { useCounter } from "usehooks-ts";
import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";
import { Link } from "react-router";

interface MirrorPublicationsListProps {
  readonly publications: Publication[];
}

const MirrorPublicationsList: FC<MirrorPublicationsListProps> = ({
  publications,
}) => {
  const { count, increment, decrement } = useCounter(1);

  const columns = useMemo<Column<Publication>[]>(
    () => [
      {
        Header: "Publication",
        Cell: ({ row: { original: publication } }: CellProps<Publication>) => {
          return (
            <Link
              to={{
                pathname: "/repositories/publications",
                search: `?sidePath=view&name=${publication.publicationId}`,
              }}
            >
              {publication.label}
            </Link>
          );
        },
      },
    ],
    [],
  );

  return (
    <>
      <ModularTable
        columns={columns}
        data={publications.slice(
          (count - 1) * DEFAULT_MODAL_PAGE_SIZE,
          count * DEFAULT_MODAL_PAGE_SIZE,
        )}
      />
      <ModalTablePagination
        current={count}
        max={Math.ceil(publications.length / DEFAULT_MODAL_PAGE_SIZE)}
        onNext={increment}
        onPrev={decrement}
      />
    </>
  );
};

export default MirrorPublicationsList;
