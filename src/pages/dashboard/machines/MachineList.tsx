import { FC, useMemo } from "react";
import { Computer } from "../../../types/Computer";
import { CheckboxInput, ModularTable } from "@canonical/react-components";
import {
  CellProps,
  Column,
  Row,
} from "@canonical/react-components/node_modules/@types/react-table";
import { Link } from "react-router-dom";
import classes from "./MachineList.module.scss";
import moment from "moment";
import {
  DISPLAY_DATE_FORMAT,
  INPUT_DATE_FORMAT,
  ROOT_PATH,
} from "../../../constants";
import classNames from "classnames";

interface MachineListProps {
  machines: Computer[];
  selectedMachines: Computer[];
  setSelectedMachines: (machines: Computer[]) => void;
  groupBy: string;
}

const MachineList: FC<MachineListProps> = ({
  machines,
  selectedMachines,
  setSelectedMachines,
  groupBy,
}) => {
  const toggleAll = () => {
    setSelectedMachines(selectedMachines.length !== 0 ? [] : machines);
  };

  const handleChange = (row: Row<Computer>) => {
    if (groupBy === "parent" && row.original.children.length > 0) {
      const childrenIds = row.original.children.map(({ id }) => id);

      selectedMachines.some(({ id }) => childrenIds.includes(id))
        ? setSelectedMachines(
            selectedMachines.filter(({ id }) => !childrenIds.includes(id)),
          )
        : setSelectedMachines([
            ...selectedMachines,
            ...row.original.children.map((child) => ({
              ...child,
              parent: row.original,
              children: [],
            })),
          ]);
    } else {
      selectedMachines.some(({ id }) => id === row.original.id)
        ? setSelectedMachines(
            selectedMachines.filter(({ id }) => id !== row.original.id),
          )
        : setSelectedMachines([...selectedMachines, row.original]);
    }
  };

  const machinesData = useMemo(() => {
    return groupBy === "parent"
      ? machines.map((machine) => ({
          ...machine,
          subRows: machine.children.map((child) => ({
            ...child,
            parent: machine,
            children: [],
          })),
        }))
      : machines;
  }, [machines, groupBy]);

  const figureCheckboxState = (computer: Computer) => {
    const selectedMachinesIds = selectedMachines.map(({ id }) => id);

    if (
      groupBy === "parent" &&
      !computer.is_wsl_instance &&
      computer.children.length > 0
    ) {
      if (
        computer.children.every(({ id }) => selectedMachinesIds.includes(id))
      ) {
        return "checked";
      }

      return computer.children.some(({ id }) =>
        selectedMachinesIds.includes(id),
      )
        ? "indeterminate"
        : "unchecked";
    }

    return selectedMachinesIds.includes(computer.id) ? "checked" : "unchecked";
  };

  const columns = useMemo<Column<Computer>[]>(
    () => [
      {
        accessor: "title",
        Header: (
          <>
            <CheckboxInput
              label={<span className="u-off-screen">Toggle all machines</span>}
              inline
              onChange={toggleAll}
              disabled={machines.length === 0}
              checked={
                selectedMachines.length === machines.length &&
                machines.length !== 0
              }
              indeterminate={
                selectedMachines.length !== 0 &&
                selectedMachines.length < machines.length
              }
            />
            <span>Name</span>
          </>
        ),
        Cell: ({ row }: CellProps<Computer>) => (
          <div
            className={classNames(classes.rowHeader, {
              [classes.nested]:
                (row as Row<Computer> & { depth: number }).depth > 0,
            })}
          >
            <CheckboxInput
              label={<span className="u-off-screen">{row.original.title}</span>}
              labelClassName="u-no-margin--bottom u-no-padding--top"
              checked={figureCheckboxState(row.original) === "checked"}
              indeterminate={
                figureCheckboxState(row.original) === "indeterminate"
              }
              onChange={() => {
                handleChange(row);
              }}
            />
            <Link
              to={
                row.original.parent
                  ? `${ROOT_PATH}instances/${row.original.parent.hostname}/${row.original.hostname}`
                  : `${ROOT_PATH}instances/${row.original.hostname}`
              }
            >
              {row.original.title}
            </Link>
          </div>
        ),
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
        accessor: "distribution",
        Header: "OS",
        Cell: ({ row }: CellProps<Computer>) => (
          <>
            {row.original.distribution.match(/\d{1,2}\.\d{2}/)
              ? `${row.original.is_wsl_instance ? "WSL - " : ""}Ubuntu\xA0${
                  row.original.distribution
                }`
              : `Windows ${row.original.distribution}`}
          </>
        ),
      },
      {
        accessor: "ubuntu_pro_info",
        Header: "Ubuntu pro",
        Cell: ({ row }: CellProps<Computer>) => (
          <>
            {row.original.ubuntu_pro_info &&
            moment(
              row.original.ubuntu_pro_info.expires,
              INPUT_DATE_FORMAT,
            ).isValid()
              ? `Exp. ${moment(
                  row.original.ubuntu_pro_info.expires,
                  INPUT_DATE_FORMAT,
                ).format(DISPLAY_DATE_FORMAT)}`
              : "---"}
          </>
        ),
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
          <>
            {moment(row.original.last_ping_time, INPUT_DATE_FORMAT).isValid()
              ? moment(row.original.last_ping_time, INPUT_DATE_FORMAT).format(
                  DISPLAY_DATE_FORMAT,
                )
              : "---"}
          </>
        ),
      },
    ],
    [selectedMachines.length, machines, groupBy],
  );

  return (
    <>
      <ModularTable
        emptyMsg="No instances found"
        columns={columns}
        data={machinesData}
      />
    </>
  );
};

export default MachineList;
