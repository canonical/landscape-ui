import { FC } from "react";
import { Computer } from "../../../types/Computer";
import { CheckboxInput, MainTable } from "@canonical/react-components";
import {
  MainTableHeader,
  MainTableRow,
} from "@canonical/react-components/dist/components/MainTable/MainTable";
import { Link } from "react-router-dom";
import { getFormattedDateTime } from "../../../utils/output";

interface MachineListProps {
  machines: Computer[];
  selectedIds: number[];
  setSelectedIds: (ids: number[] | ((prev: number[]) => number[])) => void;
}

const MachineList: FC<MachineListProps> = ({
  machines,
  selectedIds,
  setSelectedIds,
}) => {
  const toggleAll = () => {
    setSelectedIds((prevState) =>
      prevState.length !== 0 ? [] : machines.map(({ id }) => id)
    );
  };

  const headers: MainTableHeader[] = [
    {
      content: (
        <>
          <CheckboxInput
            label={<span className="u-off-screen">Toggle all</span>}
            inline
            onChange={toggleAll}
            checked={
              selectedIds.length === machines.length && machines.length !== 0
            }
            indeterminate={
              selectedIds.length !== 0 && selectedIds.length < machines.length
            }
          />
          <span>Name</span>
        </>
      ),
    },
    { content: "Host name" },
    { content: "Last ping time" },
    { content: "Upgrades" },
    { content: "Ubuntu pro" },
    { content: "Tags" },
  ];

  const handleChange = (machineId: number) => {
    setSelectedIds((prevState) => {
      if (prevState.includes(machineId)) {
        return prevState.filter((id) => id !== machineId);
      }

      return [...prevState, machineId];
    });
  };

  const rows: MainTableRow[] = machines.map((machine) => ({
    columns: [
      {
        content: (
          <>
            <CheckboxInput
              label={<span className="u-off-screen">{machine.title}</span>}
              inline
              checked={selectedIds.includes(machine.id)}
              onChange={() => {
                handleChange(machine.id);
              }}
            />
            <Link
              to={`/machines/${machine.hostname
                .toLowerCase()
                .replace(/ /g, "-")}`}
            >
              {machine.title}
            </Link>
          </>
        ),
        role: "rowheader",
        "aria-label": "Name",
      },
      {
        content: machine.hostname,
        "aria-label": "Host name",
      },
      {
        content: getFormattedDateTime(machine.last_ping_time),
        "aria-label": "Last ping time",
      },
      {
        content: "",
        "aria-label": "Upgrades",
      },
      {
        content: "",
        "aria-label": "Ubuntu pro",
      },
      {
        content: machine.tags.join(", "),
        "aria-label": "Tags",
      },
    ],
  }));

  return (
    <>
      <MainTable
        headers={headers}
        rows={rows}
        emptyStateMsg="No machines found"
      />
    </>
  );
};

export default MachineList;
