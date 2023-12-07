import { FC, useState } from "react";
import { mockProcesses } from "./_data";
import {
  Button,
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
  const [search, setSearch] = useState("");
  const [inputText, setInputText] = useState("");
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

  const getFilteredProcesses = () => {
    return search
      ? processes.filter(({ name }) => name.match(search))
      : processes;
  };

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

  const rows: MainTableRow[] = getFilteredProcesses().map(
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
                    setSelected((prevState) => {
                      return prevState.includes(pid)
                        ? prevState.filter(
                            (prevStatePid) => prevStatePid !== pid,
                          )
                        : [...prevState, pid];
                    });
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
  const handleClearSearchBox = () => {
    setSearch("");
    setInputText("");
    setCurrentPage(1);
  };
  const handleEndProcess = () => {
    // TODO: add endProcess Activity API call
  };
  const handleKillProcess = () => {
    // TODO: add killProcess Activity API call
  };
  return (
    <>
      <div className={classes.header}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSearch(inputText);
            setCurrentPage(1);
          }}
          noValidate
        >
          <SearchBox
            externallyControlled
            shouldRefocusAfterReset
            aria-label="Process search"
            onChange={(inputValue) => {
              setInputText(inputValue);
            }}
            value={inputText}
            onSearch={() => {
              setSearch(inputText);
              setCurrentPage(1);
            }}
            onClear={handleClearSearchBox}
            className={classes.search}
          />
        </form>
        <div className="p-segmented-control">
          <div className="p-segmented-control__list">
            <Button
              className="p-segmented-control__button"
              disabled={0 === selected.length}
              onClick={handleEndProcess}
            >
              End process
            </Button>
            <Button
              className="p-segmented-control__button"
              disabled={0 === selected.length}
              onClick={handleKillProcess}
            >
              Kill process
            </Button>
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
        totalItems={totalProcesses}
        paginate={handlePaginate}
        pageSize={processesPerPage}
        setPageSize={setProcessesPerPage}
        description={
          totalProcesses > 0 &&
          `Showing ${processes.length} out of ${totalProcesses} processes`
        }
      />
    </>
  );
};

export default ProcessesPanel;
