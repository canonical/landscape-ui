import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import TablePagination from "@/components/layout/TablePagination";
import { ProcessesHeader, ProcessesList } from "@/features/processes";
import useDebug from "@/hooks/useDebug";
import { useProcesses } from "@/hooks/useProcesses";
import { FC, useMemo, useState } from "react";

interface ProcessesPanelProps {
  instanceId: number;
}

const ProcessesPanel: FC<ProcessesPanelProps> = ({ instanceId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [selectedPids, setSelectedPids] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  const { getProcessesQuery } = useProcesses();
  const debug = useDebug();
  const {
    data: getProcessesQueryResult,
    error: getProcessesQueryError,
    isLoading,
  } = getProcessesQuery({
    computer_id: instanceId,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: search,
  });

  if (getProcessesQueryError) {
    debug(getProcessesQueryError);
  }

  const totalProcesses = getProcessesQueryResult?.data.count ?? 0;

  const handlePaginate = (page: number) => {
    setCurrentPage(page);
    setSelectedPids([]);
  };

  const processes = useMemo(
    () => getProcessesQueryResult?.data.results ?? [],
    [getProcessesQueryResult],
  );

  return (
    <>
      {!search && isLoading && currentPage === 1 && pageSize === 20 && (
        <LoadingState />
      )}
      {!isLoading &&
        !search &&
        (!getProcessesQueryResult ||
          getProcessesQueryResult.data.results.length === 0) && (
          <EmptyState icon="connected" title="No processes running" />
        )}

      {(search ||
        currentPage !== 1 ||
        pageSize !== 20 ||
        (getProcessesQueryResult &&
          getProcessesQueryResult?.data.results.length > 0)) && (
        <>
          <ProcessesHeader
            instanceId={instanceId}
            onPageChange={handlePaginate}
            onSearch={(searchText) => {
              setSearch(searchText);
            }}
            selectedPids={selectedPids}
            setSelectedPids={(pids) => setSelectedPids(pids)}
          />
          <ProcessesList
            processes={processes}
            setSelectedPids={(pids) => setSelectedPids(pids)}
            selectedPids={selectedPids}
          />
        </>
      )}
      <TablePagination
        currentPage={currentPage}
        totalItems={totalProcesses}
        paginate={handlePaginate}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentItemCount={processes.length}
      />
    </>
  );
};

export default ProcessesPanel;
