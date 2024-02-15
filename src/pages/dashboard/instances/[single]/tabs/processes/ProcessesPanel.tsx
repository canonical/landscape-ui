import { FC, useMemo, useState } from "react";
import { mockProcesses } from "../../../_data";
import { CheckboxInput, ModularTable } from "@canonical/react-components";
import TablePagination from "../../../../../../components/layout/TablePagination";
import { useParams } from "react-router-dom";
import useDebug from "../../../../../../hooks/useDebug";
import { useProcesses } from "../../../../../../hooks/useProcesses";
import useInstances from "../../../../../../hooks/useInstances";
import ProcessesPanelHeader from "./ProcessesPanelHeader";
import { Instance } from "../../../../../../types/Instance";
import { CellProps, Column } from "react-table";
import { Process } from "../../../../../../types/Process";

const ProcessesPanel: FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [selectedPids, setSelectedPids] = useState<number[]>([]);
  const [search, setSearch] = useState("");

  const { hostname } = useParams();
  const debug = useDebug();
  const { getInstancesQuery } = useInstances();
  const { getProcessesQuery } = useProcesses();

  const handlePaginate = (page: number) => {
    setCurrentPage(page);
    setSelectedPids([]);
  };

  const { data: getInstancesQueryResult, error: getInstancesQueryError } =
    getInstancesQuery({ query: `hostname:${hostname}` });

  if (getInstancesQueryError) {
    debug(getInstancesQueryError);
  }

  const instance = getInstancesQueryResult?.data.results[0] ?? null;

  const { data: getProcessesQueryResult, error: getProcessesQueryError } =
    getProcessesQuery({ query: `hostname=${hostname}` }, { enabled: false });

  if (getProcessesQueryError) {
    debug(getProcessesQueryError);
  }

  const toggleAll = () => {
    setSelectedPids((prevState) =>
      0 === prevState.length ? processes.map(({ pid }) => pid) : [],
    );
  };

  const getProcesses = (
    instance: Instance | null,
    limit: number,
    offset: number,
  ) => {
    if (!instance) {
      return [];
    }

    return mockProcesses
      .filter(({ computer_id }) => computer_id === instance.id)
      .slice(offset, offset + limit);
  };

  const processes = useMemo(
    () =>
      (getProcessesQueryResult
        ? getProcessesQueryResult.data.results
        : getProcesses(instance, pageSize, (currentPage - 1) * pageSize)
      ).filter(({ name }) => name.match(search)),
    [getProcessesQueryResult, instance, pageSize, currentPage, search],
  );

  const totalProcesses = mockProcesses.filter(
    ({ computer_id }) => computer_id === instance?.id,
  ).length;

  const columns = useMemo<Column<Process>[]>(
    () => [
      {
        accessor: "name",
        Header: (
          <>
            <CheckboxInput
              inline
              label={<span className="u-off-screen">Toggle all processes</span>}
              checked={
                selectedPids.length > 0 &&
                selectedPids.length === processes.length
              }
              disabled={processes.length === 0}
              onChange={toggleAll}
              indeterminate={
                selectedPids.length > 0 &&
                selectedPids.length < processes.length
              }
            />
            <span>Command</span>
          </>
        ),
        Cell: ({ row }: CellProps<Process>) => {
          return (
            <>
              <CheckboxInput
                inline
                label={
                  <span className="u-off-screen">{`Select process ${row.original.name}`}</span>
                }
                checked={selectedPids.includes(row.original.pid)}
                onChange={() => {
                  setSelectedPids((prevState) => {
                    return prevState.includes(row.original.pid)
                      ? prevState.filter(
                          (prevStatePid) => prevStatePid !== row.original.pid,
                        )
                      : [...prevState, row.original.pid];
                  });
                }}
              />
              <span>{row.original.name}</span>
            </>
          );
        },
      },
      {
        accessor: "state",
        Header: "State",
      },
      {
        accessor: "vm_size",
        Header: "VM size",
      },
      {
        accessor: "cpu_utilization",
        Header: "CPU (%)",
        Cell: ({ row }: CellProps<Process>) => {
          return (100 * row.original.cpu_utilization).toFixed(1);
        },
      },
      {
        accessor: "pid",
        Header: "PID",
      },
      {
        accessor: "start_time",
        Header: "Started at",
      },
      {
        accessor: "uid",
        Header: "User",
      },
      {
        accessor: "gid",
        Header: "Group",
      },
    ],
    [processes, selectedPids.length],
  );

  return (
    instance && (
      <>
        <ProcessesPanelHeader
          instanceId={instance.id}
          onPageChange={handlePaginate}
          onSearch={(searchText) => {
            setSearch(searchText);
          }}
          selectedPids={selectedPids}
        />
        <ModularTable
          columns={columns}
          data={processes}
          emptyMsg="No processes"
        />
        <TablePagination
          currentPage={currentPage}
          totalItems={totalProcesses}
          paginate={handlePaginate}
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentItemCount={processes.length}
        />
      </>
    )
  );
};

export default ProcessesPanel;
