import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import TablePaginationBase from "../TablePaginationBase";

interface TablePaginationProps {
  readonly totalItems: number | undefined;
  readonly className?: string;
  readonly handleClearSelection?: () => void;
  readonly currentItemCount?: number;
}

const TablePagination: FC<TablePaginationProps> = ({
  totalItems,
  className = "",
  currentItemCount = 0,
  handleClearSelection,
}) => {
  const { currentPage, pageSize, setPageParams } = usePageParams();

  const paginate = (page: number) => {
    setPageParams({
      currentPage: page,
    });

    if (handleClearSelection) {
      handleClearSelection();
    }
  };

  const setPageSize = (pageSize: number) => {
    setPageParams({ pageSize });
  };

  return (
    <TablePaginationBase
      className={className}
      currentItemCount={currentItemCount}
      currentPage={currentPage}
      pageSize={pageSize}
      paginate={paginate}
      setPageSize={setPageSize}
      totalItems={totalItems}
    />
  );
};

export default TablePagination;
