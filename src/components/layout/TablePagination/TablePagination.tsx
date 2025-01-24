import { FC } from "react";
import usePageParams from "@/hooks/usePageParams";
import SidePanelTablePagination from "./SidePanelTablePagination";

interface TablePaginationProps {
  totalItems: number | undefined;
  className?: string;
  handleClearSelection?: () => void;
  currentItemCount?: number;
}

const TablePagination: FC<TablePaginationProps> = ({
  totalItems,
  className = "",
  currentItemCount = 0,
  handleClearSelection,
}) => {
  const { currentPage, pageSize, setPageParams } = usePageParams();

  return (
    <SidePanelTablePagination
      className={className}
      currentItemCount={currentItemCount}
      currentPage={currentPage}
      pageSize={pageSize}
      paginate={(page) => {
        setPageParams({
          currentPage: page,
        });

        handleClearSelection?.();
      }}
      setPageSize={(pageSize) => {
        setPageParams({
          pageSize,
        });
      }}
      totalItems={totalItems}
    />
  );
};

export default TablePagination;
