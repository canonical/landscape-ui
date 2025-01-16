import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import { TablePagination } from "@/components/layout/TablePagination";
import {
  ProcessesHeader,
  ProcessesList,
  useProcesses,
} from "@/features/processes";
import usePageParams from "@/hooks/usePageParams";
import { UrlParams } from "@/types/UrlParams";
import { FC, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

const ProcessesPanel: FC = () => {
  const [selectedPids, setSelectedPids] = useState<number[]>([]);

  const { instanceId: urlInstanceId, childInstanceId } = useParams<UrlParams>();
  const { search, currentPage, pageSize } = usePageParams();
  const { getProcessesQuery } = useProcesses();

  const instanceId = Number(childInstanceId ?? urlInstanceId);

  const { data: getProcessesQueryResult, isLoading } = getProcessesQuery({
    computer_id: instanceId,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: search,
  });

  const totalProcesses = getProcessesQueryResult?.data.count ?? 0;

  const processes = useMemo(
    () => getProcessesQueryResult?.data.results ?? [],
    [getProcessesQueryResult],
  );

  const handleClearSelection = () => {
    setSelectedPids([]);
  };

  return (
    <>
      {!search && isLoading && <LoadingState />}
      {!isLoading &&
        !search &&
        (!getProcessesQueryResult ||
          getProcessesQueryResult.data.results.length === 0) && (
          <EmptyState icon="connected" title="No processes running" />
        )}

      {(search ||
        (!isLoading &&
          getProcessesQueryResult &&
          getProcessesQueryResult.data.results.length > 0)) && (
        <>
          <ProcessesHeader
            handleClearSelection={handleClearSelection}
            selectedPids={selectedPids}
          />
          <ProcessesList
            processes={processes}
            setSelectedPids={(pids) => setSelectedPids(pids)}
            selectedPids={selectedPids}
          />
        </>
      )}
      <TablePagination
        handleClearSelection={handleClearSelection}
        totalItems={totalProcesses}
        currentItemCount={processes.length}
      />
    </>
  );
};

export default ProcessesPanel;
