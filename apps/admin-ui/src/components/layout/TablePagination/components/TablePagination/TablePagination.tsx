import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import TablePaginationBase from "../TablePaginationBase";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import { PAGE_SIZE_OPTIONS } from "../TablePaginationBase/constants";
import { useTotalPages } from "../../hooks";

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
  const totalPages = useTotalPages(totalItems, pageSize);

  useSetDynamicFilterValidation(
    "pageSize",
    PAGE_SIZE_OPTIONS.map((option) => option.value.toString()),
  );

  useSetDynamicFilterValidation(
    "currentPage",
    Array.from({ length: totalPages }, (_, i) => (i + 1).toString()),
  );

  const paginate = (page: number) => {
    setPageParams({ currentPage: page });

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
