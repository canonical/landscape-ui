import { FC, useState } from "react";
import LoadingState from "@/components/layout/LoadingState";
import TablePagination from "@/components/layout/TablePagination";
import { ScriptList, ScriptsEmptyState, useScripts } from "@/features/scripts";

interface ScriptsContainerProps {}

const ScriptsContainer: FC<ScriptsContainerProps> = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { getScriptsQuery } = useScripts();

  const { data: getScriptsQueryResult, isLoading: getScriptsQueryLoading } =
    getScriptsQuery({
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    });

  return (
    <>
      {currentPage === 1 && pageSize === 20 && getScriptsQueryLoading && (
        <LoadingState />
      )}
      {currentPage === 1 &&
        pageSize === 20 &&
        !getScriptsQueryLoading &&
        (!getScriptsQueryResult ||
          getScriptsQueryResult.data.results.length === 0) && (
          <ScriptsEmptyState />
        )}
      {currentPage !== 1 ||
        pageSize !== 20 ||
        (!getScriptsQueryLoading &&
          getScriptsQueryResult &&
          getScriptsQueryResult.data.results.length > 0 && (
            <>
              <ScriptList
                isScriptsLoading={getScriptsQueryLoading}
                scripts={getScriptsQueryResult?.data.results ?? []}
              />
              <TablePagination
                currentPage={currentPage}
                totalItems={getScriptsQueryResult?.data.count}
                paginate={(page) => {
                  setCurrentPage(page);
                }}
                pageSize={pageSize}
                setPageSize={(itemsNumber) => {
                  setPageSize(itemsNumber);
                }}
                currentItemCount={getScriptsQueryResult.data.results.length}
              />
            </>
          ))}
    </>
  );
};

export default ScriptsContainer;
