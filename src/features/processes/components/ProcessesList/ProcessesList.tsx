import { CheckboxInput } from "@canonical/react-components";
import type { CellProps, Column } from "react-table";
import type { FC } from "react";
import { useMemo } from "react";
import type { Process } from "../../types";
import ResponsiveTable from "@/components/layout/ResponsiveTable";

interface ProcessesListProps {
  readonly processes: Process[];
  readonly selectedPids: number[];
  readonly setSelectedPids: (pids: number[]) => void;
}

const ProcessesList: FC<ProcessesListProps> = ({
  processes,
  selectedPids,
  setSelectedPids,
}) => {
  const toggleAll = () => {
    setSelectedPids(
      0 === selectedPids.length ? processes.map(({ pid }) => pid) : [],
    );
  };

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
                  setSelectedPids(
                    selectedPids.includes(row.original.pid)
                      ? selectedPids.filter(
                          (prevStatePid) => prevStatePid !== row.original.pid,
                        )
                      : [...selectedPids, row.original.pid],
                  );
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
          return <>{(100 * row.original.cpu_utilisation).toFixed(1)}%</>;
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
        accessor: "gid",
        Header: "Group",
      },
    ],
    [processes, selectedPids],
  );

  return (
    <ResponsiveTable
      columns={columns}
      data={processes}
      emptyMsg="No processes found"
    />
  );
};

export default ProcessesList;
