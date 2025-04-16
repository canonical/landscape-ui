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
  const { currentPage, pageSize } = usePageParams();

  const { scripts, scriptsCount, isScriptsLoading } = useGetScripts();

  if (isScriptsLoadingState(currentPage, pageSize, isScriptsLoading)) {
    return <LoadingState />;
  }

  if (
    isScriptsEmptyState(currentPage, pageSize, isScriptsLoading, scriptsCount)
  ) {
    return <ScriptsEmptyState />;
  }

  return (
    <>
      <ScriptsHeader />
      <ScriptList scripts={scripts} />
      <TablePagination
        totalItems={scriptsCount}
        currentItemCount={scripts.length}
      />
    </>
  );
};

export default ScriptsContainer;
