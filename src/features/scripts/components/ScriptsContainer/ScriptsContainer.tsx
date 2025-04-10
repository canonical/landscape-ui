import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import type { Script } from "@/features/scripts";
import { ScriptList, ScriptsEmptyState } from "@/features/scripts";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import ScriptsHeader from "./components/ScriptsHeader";
import { isScriptsEmptyState, isScriptsLoadingState } from "./helpers";

interface ScriptsContainerProps {
  readonly scripts: Script[];
  readonly scriptsCount: number;
  readonly isScriptsLoading: boolean;
}

const ScriptsContainer: FC<ScriptsContainerProps> = ({
  scripts,
  scriptsCount,
  isScriptsLoading,
}) => {
  const { currentPage, pageSize } = usePageParams();

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
