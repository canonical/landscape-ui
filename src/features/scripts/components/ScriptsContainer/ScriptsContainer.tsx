import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import {
  ScriptList,
  ScriptsEmptyState,
  useGetScripts,
} from "@/features/scripts";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import ScriptsHeader from "./components/ScriptsHeader";
import { isScriptsEmptyState, isScriptsLoadingState } from "./helpers";

const ScriptsContainer: FC = () => {
  const { currentPage, pageSize, search } = usePageParams();

  const { scripts, scriptsCount, isScriptsLoading } = useGetScripts();

  if (
    isScriptsEmptyState(
      currentPage,
      pageSize,
      isScriptsLoading,
      scriptsCount,
      search,
    )
  ) {
    return <ScriptsEmptyState />;
  }

  return (
    <>
      <ScriptsHeader />
      {isScriptsLoadingState(
        currentPage,
        pageSize,
        isScriptsLoading,
        search,
      ) ? (
        <LoadingState />
      ) : (
        <ScriptList scripts={scripts} />
      )}
      <TablePagination
        totalItems={scriptsCount}
        currentItemCount={scripts.length}
      />
    </>
  );
};

export default ScriptsContainer;
