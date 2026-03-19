import type { Instance } from "@/types/Instance";
import { ModularTable } from "@canonical/react-components";
import { useMemo, useState, type FC } from "react";
import type { CellProps, Column } from "react-table";
import TruncatedCell from "@/components/layout/TruncatedCell";
import { useExpandableRow } from "@/hooks/useExpandableRow";
import { getCellProps, getRowProps } from "./helpers";
import { ModalTablePagination } from "@/components/layout/TablePagination";
import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";
import { DEFAULT_CURRENT_PAGE } from "@/libs/pageParamsManager/constants";

interface RunScriptFormInstanceListProps {
  readonly instances: Instance[];
  readonly tags: string[];
}

const RunScriptFormInstanceList: FC<RunScriptFormInstanceListProps> = ({
  instances,
  tags,
}) => {
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE);

  const { expandedRowIndex, expandedColumnId, getTableRowsRef, handleExpand } =
    useExpandableRow();

  const maxPage = Math.max(
    1,
    Math.ceil(instances.length / DEFAULT_MODAL_PAGE_SIZE),
  );
  const page = Math.min(currentPage, maxPage);
  const offset = (page - 1) * DEFAULT_MODAL_PAGE_SIZE;
  const currentInstances = instances.slice(
    offset,
    offset + DEFAULT_MODAL_PAGE_SIZE,
  );

  const columns = useMemo<Column<Instance>[]>(
    () => [
      {
        Header: "Instance",
        accessor: "title",
        Cell: ({ row: { original: instance } }: CellProps<Instance>) =>
          instance.title,
      },
      {
        accessor: "tags",
        Header: "Associated tag",
        meta: {
          isExpandable: true,
        },
        Cell: ({ row: { original: instance, index } }: CellProps<Instance>) => {
          const instanceTags = instance.tags.filter((instanceTag) =>
            tags.some((tag) => tag === instanceTag),
          );
          return (
            <TruncatedCell
              isExpanded={
                expandedRowIndex === index && expandedColumnId === "tags"
              }
              onExpand={() => {
                handleExpand(index, "tags");
              }}
              content={instanceTags.map((tag) => (
                <span className="truncatedItem" key={tag}>
                  {tag}
                </span>
              ))}
              showCount
            />
          );
        },
      },
    ],
    [tags, expandedColumnId, expandedRowIndex, handleExpand],
  );

  const closeExpandedRow = () => {
    if (expandedRowIndex == null) {
      return;
    }

    handleExpand(expandedRowIndex, expandedColumnId ?? undefined);
  };

  return (
    <div ref={getTableRowsRef}>
      <ModularTable
        columns={columns}
        data={currentInstances}
        getCellProps={getCellProps(expandedRowIndex, expandedColumnId)}
        getRowProps={getRowProps(expandedRowIndex)}
      />

      {maxPage > 1 && (
        <ModalTablePagination
          current={page}
          max={maxPage}
          onNext={() => {
            closeExpandedRow();
            setCurrentPage((prevState) => Math.min(prevState + 1, maxPage));
          }}
          onPrev={() => {
            closeExpandedRow();
            setCurrentPage((prevState) =>
              Math.max(prevState - 1, DEFAULT_CURRENT_PAGE),
            );
          }}
        />
      )}
    </div>
  );
};

export default RunScriptFormInstanceList;
