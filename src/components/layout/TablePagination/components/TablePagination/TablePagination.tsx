import usePageParams from "@/hooks/usePageParams";
import { FC } from "react";
import TablePaginationBase from "../TablePaginationBase";

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
    <TablePaginationBase
      className={className}
      currentItemCount={currentItemCount}
      totalItems={totalItems}
      pageSize={pageSize}
      paginate={(page: number) => {
        setPageParams({
          currentPage: page,
        });

        if (handleClearSelection) {
          handleClearSelection();
        }
      }}
      setPageSize={(pageSize: number) => {
        setPageParams({ pageSize });
      }}
      currentPage={currentPage}
    />
  );
};

export default TablePagination;
