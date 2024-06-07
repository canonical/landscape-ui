import { FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import { ScriptList, ScriptsEmptyState, useScripts } from "@/features/scripts";
import { usePageParams } from "@/hooks/usePageParams";

interface ScriptsContainerProps {}

const ScriptsContainer: FC<ScriptsContainerProps> = () => {
  const { currentPage, pageSize } = usePageParams();
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
                totalItems={getScriptsQueryResult?.data.count}
                currentItemCount={getScriptsQueryResult.data.results.length}
              />
            </>
          ))}
    </>
  );
};

export default ScriptsContainer;
