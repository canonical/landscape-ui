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

  const { scripts, scriptsCount, isGettingScripts, hasGotScripts } =
    useGetScripts();
  const isFilteringScripts = !!status || !!search;
  const shouldCheckAllScripts =
    !isFilteringScripts && hasGotScripts && scriptsCount === 0;

  const {
    scriptsCount: allScriptsCount,
    isGettingScripts: isGettingAllScripts,
    isFetchingScripts: isFetchingAllScripts,
    hasGotScripts: hasGotAllScripts,
  } = useGetScripts(
    { listenToUrlParams: false },
    { script_type: "v2", limit: 0, offset: 0 },
    { enabled: shouldCheckAllScripts },
  );

  const hasNoScripts =
    shouldCheckAllScripts &&
    hasGotAllScripts &&
    !isFetchingAllScripts &&
    allScriptsCount === 0;

  if (hasNoScripts) {
    return <ScriptsEmptyState />;
  }

  return (
    <>
      <ScriptsHeader />
      {isGettingScripts ||
      (shouldCheckAllScripts &&
        (isGettingAllScripts || isFetchingAllScripts)) ? (
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
