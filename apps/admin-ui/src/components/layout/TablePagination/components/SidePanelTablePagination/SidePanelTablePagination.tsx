import type { FC } from "react";
import TablePaginationBase from "../TablePaginationBase";

interface SidePanelTablePaginationProps {
  readonly currentPage: number;
  readonly pageSize: number;
  readonly paginate: (page: number) => void;
  readonly setPageSize: (itemsNumber: number) => void;
  readonly totalItems: number | undefined;
  readonly className?: string;
  readonly currentItemCount?: number;
}

const SidePanelTablePagination: FC<SidePanelTablePaginationProps> = ({
  currentPage,
  pageSize,
  paginate,
  setPageSize,
  totalItems,
  className = "",
  currentItemCount = 0,
}) => {
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

export default SidePanelTablePagination;
