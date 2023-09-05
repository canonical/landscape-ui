import { FC, useMemo } from "react";
import { Computer } from "../../../types/Computer";
import { CheckboxInput, ModularTable } from "@canonical/react-components";
import {
  CellProps,
  Column,
  Row,
} from "@canonical/react-components/node_modules/@types/react-table";
import { Link } from "react-router-dom";
import { getFormattedDateTime } from "../../../utils/output";
import classes from "./MachineList.module.scss";
import { isComputer } from "./_helpers";

interface MachineListProps {
  machines: Computer[];
  selectedIds: number[];
  setSelectedIds: (ids: number[]) => void;
}

const MachineList: FC<MachineListProps> = ({
  machines,
  selectedIds,
  setSelectedIds,
}) => {
  const toggleAll = () => {
    setSelectedIds(
      selectedIds.length !== 0 ? [] : machines.map(({ id }) => id)
    );
  };

  const handleChange = (row: Row<Record<string, unknown>>) => {
    if (!isComputer(row.original)) {
      return;
    }

    selectedIds.includes(row.original.id)
      ? setSelectedIds(selectedIds.filter((id) => id !== row.original.id))
      : setSelectedIds([...selectedIds, row.original.id]);
  };

  const machinesData: Record<string, unknown>[] = useMemo(
    () => machines,
    [machines]
  );

  const cols = useMemo<
    (Column<Record<string, unknown>> & { className?: string })[]
  >(
    () => [
      {
        Header: (
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
        accessor: "title",
        Cell: ({ value, row }: CellProps<Record<string, unknown>, unknown>) =>
          "string" === typeof value && isComputer(row.original) ? (
            <>
              <CheckboxInput
                label={<span className="u-off-screen">{value}</span>}
                inline
                checked={selectedIds.includes(row.original.id)}
                onChange={() => {
                  handleChange(row);
                }}
              />
              <Link
                to={`/machines/${row.original.hostname
                  .toLowerCase()
                  .replace(/ /g, "-")}`}
              >
                {value}
              </Link>
            </>
          ) : null,
        className: classes.name,
      },
      {
        Header: "Status",
        accessor: "reboot_required_flag",
        Cell: ({ value }: CellProps<Record<string, unknown>, unknown>) =>
          "boolean" === typeof value && value ? (
            <>Reboot required</>
          ) : (
            <>No action required</>
          ),
        getCellIcon: ({ value }: CellProps<Computer, boolean>) => {
          if (value) {
            return `restart ${classes.restartError}`;
          }

          return false;
        },
      },
      {
        Header: "Upgrades",
      },
      {
        Header: "Ubuntu pro",
      },
      {
        Header: "Host name",
        accessor: "hostname",
        Cell: ({ value }: CellProps<Record<string, unknown>, unknown>) =>
          "string" === typeof value ? <>value</> : null,
      },
      {
        Header: "Last ping time",
        accessor: "last_ping_time",
        Cell: ({ value }: CellProps<Record<string, unknown>, unknown>) =>
          "string" === typeof value ? <>{getFormattedDateTime(value)}</> : null,
      },
    ],
    [selectedIds, machines]
  );

  return (
    <>
      <ModularTable
        emptyMsg="No machines found"
        columns={cols}
        data={machinesData}
      />
    </>
  );
};

export default MachineList;
