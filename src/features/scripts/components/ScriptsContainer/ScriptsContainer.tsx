import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import {
  ScriptList,
  ScriptsEmptyState,
  useGetScripts,
} from "@/features/scripts";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import ScriptsHeader from "../ScriptsHeader";

const ScriptsContainer: FC = () => {
  const { search, status } = usePageParams();

  const { scripts, scriptsCount, isGettingScripts } =
    useGetScripts();

  const isFilteringScripts = !!status || !!search;

  const hasNoScripts =
    !isFilteringScripts && scriptsCount === 0 && !isGettingScripts;

  if (hasNoScripts) {
    return <ScriptsEmptyState />;
  }

  return (
    <>
      <ScriptsHeader />
      {isGettingScripts ? (
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
