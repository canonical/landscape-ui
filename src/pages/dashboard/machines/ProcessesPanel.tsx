import { FC, useState } from "react";
import { mockProcesses } from "./_data";
import {
  CheckboxInput,
  MainTable,
  SearchBox,
} from "@canonical/react-components";
import {
  MainTableHeader,
  MainTableRow,
} from "@canonical/react-components/dist/components/MainTable/MainTable";
import TablePagination from "../../../components/layout/TablePagination";
import classes from "./ProcessesPanel.module.scss";

interface ProcessesPanelProps {
  machineId: number;
}

const ProcessesPanel: FC<ProcessesPanelProps> = ({ machineId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [processesPerPage, setProcessesPerPage] = useState(50);
  const [selected, setSelected] = useState<number[]>([]);

  const toggleAll = () => {
    setSelected((prevState) =>
      0 === prevState.length ? processes.map(({ pid }) => pid) : [],
    );
  };

  const getProcesses = (machineId: number, limit: number, offset: number) => {
    return mockProcesses
      .filter(({ computer_id }) => computer_id === machineId)
      .slice(offset, offset + limit);
  };

  const processes = getProcesses(
    machineId,
    processesPerPage,
    (currentPage - 1) * processesPerPage,
  );

  const totalProcesses = mockProcesses.filter(
    ({ computer_id }) => computer_id === machineId,
  ).length;

  const headers: MainTableHeader[] = [
    {
      content: (
        <>
          <CheckboxInput
            inline
            label={<span className="u-off-screen">Toggle all</span>}
            checked={selected.length === processes.length}
            onChange={toggleAll}
            indeterminate={
              selected.length > 0 && selected.length < processes.length
            }
          />
          <span>Command</span>
        </>
      ),
    },
    { content: "State" },
    { content: "VM size" },
    { content: "CPU (%)" },
    { content: "PID" },
    { content: "Started at" },
    { content: "User" },
    { content: "Group" },
  ];

  const rows: MainTableRow[] = processes.map(
    ({ name, state, vm_size, cpu_utilization, pid, start_time, uid, gid }) => {
      return {
        columns: [
          {
            content: (
              <>
                <CheckboxInput
                  inline
                  label={
                    <span className="u-off-screen">{`Select process ${name}`}</span>
                  }
                  checked={selected.includes(pid)}
                  onChange={() => {
                    setSelected((prevState) =>
                      prevState.includes(pid)
                        ? prevState.filter((pid) => pid !== pid)
                        : [...prevState, pid],
                    );
                  }}
                />
                <span>{name}</span>
              </>
            ),
            role: "rowheader",
            "aria-label": `Command ${name}`,
          },
          { content: state, "aria-label": "State" },
          { content: vm_size, "aria-label": "VM size" },
          {
            content: (100 * cpu_utilization).toFixed(1),
            "aria-label": "CPU (%)",
          },
          { content: pid, "aria-label": "PID" },
          { content: start_time, "aria-label": "Started at" },
          { content: uid, "aria-label": "User" },
          { content: gid, "aria-label": "Group" },
        ],
      };
    },
  );

  const handlePaginate = (page: number) => {
    setCurrentPage(page);
    setSelected([]);
  };

  return (
    <>
      <div className={classes.header}>
        <SearchBox className={classes.search} />
        <div className="p-segmented-control">
          <div className="p-segmented-control__list">
            <button
              className="p-segmented-control__button"
              disabled={0 === selected.length}
            >
              End process
            </button>
            <button
              className="p-segmented-control__button"
              disabled={0 === selected.length}
            >
              Kill process
            </button>
          </div>
        </div>
      </div>
      <MainTable
        headers={headers}
        rows={rows}
        emptyStateMsg="No processes found."
      />
      <TablePagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalProcesses / processesPerPage)}
        paginate={handlePaginate}
        itemsPerPage={processesPerPage}
        setItemsPerPage={setProcessesPerPage}
        description={
          totalProcesses > 0 &&
          `Showing ${processes.length} out of ${totalProcesses} processes`
        }
      />
    </>
  );
};

export default ProcessesPanel;
