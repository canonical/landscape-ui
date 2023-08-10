import { FC, useState } from "react";
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
}

const MachineList: FC<MachineListProps> = ({ machines }) => {
  const [selected, setSelected] = useState<number[]>([]);

  const toggleAll = () => {
    setSelected((prevState) =>
      prevState.length !== 0 ? [] : machines.map((_, i) => i)
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
              selected.length === machines.length && machines.length !== 0
            }
            indeterminate={
              selected.length !== 0 && selected.length < machines.length
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

  const handleChange = (rowIndex: number) => {
    setSelected((prevState) => {
      if (prevState.includes(rowIndex)) {
        return prevState.filter((row) => row !== rowIndex);
      }

      return [...prevState, rowIndex];
    });
  };

  const rows: MainTableRow[] = machines.map((machine, index) => ({
    columns: [
      {
        content: (
          <>
            <CheckboxInput
              label={<span className="u-off-screen">{machine.title}</span>}
              inline
              checked={selected.includes(index)}
              onChange={() => {
                handleChange(index);
              }}
            />
            <Link
              to={`/machines/${machine.title.toLowerCase().replace(/ /g, "-")}`}
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
