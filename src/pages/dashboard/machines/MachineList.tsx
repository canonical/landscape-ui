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
      selectedIds.length !== 0 ? [] : machines.map(({ id }) => id),
    );
  };

  const handleChange = (row: Row<Computer>) => {
    selectedIds.includes(row.original.id)
      ? setSelectedIds(selectedIds.filter((id) => id !== row.original.id))
      : setSelectedIds([...selectedIds, row.original.id]);
  };

  const machinesData = useMemo(() => machines, [machines]);

  const columns = useMemo<Column<Computer>[]>(
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
        Cell: ({ row }: CellProps<Computer>) => (
          <>
            <CheckboxInput
              label={<span className="u-off-screen">{row.original.title}</span>}
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
              {row.original.title}
            </Link>
          </>
        ),
        className: classes.name,
      },
      {
        Header: "Status",
        accessor: "reboot_required_flag",
        Cell: ({ row }: CellProps<Computer>) =>
          row.original.reboot_required_flag ? (
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
        Cell: ({ row }: CellProps<Computer>) => <>{row.original.hostname}</>,
      },
      {
        Header: "Last ping time",
        accessor: "last_ping_time",
        Cell: ({ row }: CellProps<Computer>) => (
          <>{getFormattedDateTime(row.original.last_ping_time)}</>
        ),
      },
    ],
    [selectedIds, machines],
  );

  return (
    <>
      <ModularTable
        emptyMsg="No machines found"
        columns={columns}
        data={machinesData}
      />
    </>
  );
};

export default MachineList;
