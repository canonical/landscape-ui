import { FC } from "react";
import TablePaginationBase from "../TablePaginationBase";

interface SidePanelTablePaginationProps {
  currentPage: number;
  pageSize: number;
  paginate: (page: number) => void;
  setPageSize: (itemsNumber: number) => void;
  totalItems: number | undefined;
  className?: string;
  currentItemCount?: number;
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
