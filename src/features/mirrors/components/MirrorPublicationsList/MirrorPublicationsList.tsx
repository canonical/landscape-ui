import type { CellProps, Column } from "react-table";
import { useListPublications } from "../../api";
import { useMemo, type FC } from "react";
import type { Publication } from "@canonical/landscape-openapi";
import { ModularTable } from "@canonical/react-components";
import { ModalTablePagination } from "@/components/layout/TablePagination";
import { useCounter } from "usehooks-ts";
import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";

interface MirrorPublicationsListProps {
  readonly mirrorName: string;
}

const MirrorPublicationsList: FC<MirrorPublicationsListProps> = ({
  mirrorName,
}) => {
  const {
    data: {
      data: { publications = [] },
    },
  } = useListPublications({
    filter: `source="${mirrorName}"`,
    pageSize: 1000,
  });

  const { count, increment, decrement } = useCounter(1);

  const columns = useMemo<Column<Publication>[]>(
    () => [
      {
        Header: "Publication",
        Cell: ({ row: { original: publication } }: CellProps<Publication>) => {
          return <a>{publication.label}</a>;
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
