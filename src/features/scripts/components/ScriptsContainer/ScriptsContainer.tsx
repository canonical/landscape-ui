import LoadingState from '@/components/layout/LoadingState';
import { TablePagination } from '@/components/layout/TablePagination';
import {
  ScriptList,
  ScriptsEmptyState,
  useGetScripts,
} from '@/features/scripts';
import usePageParams from '@/hooks/usePageParams';
import type { FC } from 'react';
import ScriptsHeader from '../ScriptsHeader';
import { isScriptsEmptyState, isScriptsLoadingState } from './helpers';

const ScriptsContainer: FC = () => {
  const { currentPage, pageSize, search, status } = usePageParams();

  const { scripts, scriptsCount, isScriptsLoading } = useGetScripts();
  const isFilteringScripts = !!search || !!status;

  if (
    isScriptsEmptyState(
      currentPage,
      pageSize,
      isScriptsLoading,
      scriptsCount,
      search,
      status,
    )
  ) {
    return <ScriptsEmptyState />;
  }

  return (
    <>
      <ScriptsHeader />
      {isScriptsLoadingState(currentPage, pageSize, isScriptsLoading) ? (
        <LoadingState />
      ) : (
        <ScriptList scripts={scripts} isFilteringScripts={isFilteringScripts} />
      )}
      <TablePagination
        totalItems={scriptsCount}
        currentItemCount={scripts.length}
      />
    </>
  );
};

export default ScriptsContainer;
