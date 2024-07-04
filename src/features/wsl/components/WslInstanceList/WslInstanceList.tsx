import { FC, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CellProps, Column } from "react-table";
import { CheckboxInput, ModularTable } from "@canonical/react-components";
import { ROOT_PATH } from "@/constants";
import { Instance, InstanceWithoutRelation } from "@/types/Instance";
import WslInstanceListActions from "../WslInstanceListActions";
import WslInstancesHeader from "../WslInstancesHeader";
import classes from "./WslInstanceList.module.scss";

interface WslInstanceListProps {
  instance: Instance;
}

const WslInstanceList: FC<WslInstanceListProps> = ({ instance }) => {
  const [selectedInstances, setSelectedInstances] = useState<
    InstanceWithoutRelation[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");

  const wslInstances = useMemo(() => {
    if (!searchQuery) {
      return instance.children;
    }

    return instance.children.filter(
      ({ title, hostname }) =>
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hostname.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [instance, searchQuery]);

  const handleInstanceCheck = (instance: InstanceWithoutRelation) => {
    setSelectedInstances((prevState) =>
      prevState.some(({ id }) => id === instance.id)
        ? prevState.filter(({ id }) => id !== instance.id)
        : [...prevState, instance],
    );
  };

  const columns = useMemo<Column<InstanceWithoutRelation>[]>(
    () => [
      {
        accessor: "title",
        Header: (
          <>
            <CheckboxInput
              inline
              label={<span className="u-off-screen">Toggle all instances</span>}
              checked={
                wslInstances.length > 0 &&
                selectedInstances.length === wslInstances.length
              }
              indeterminate={
                selectedInstances.length > 0 &&
                selectedInstances.length < wslInstances.length
              }
              onChange={() => {
                setSelectedInstances(
                  selectedInstances.length > 0 ? [] : wslInstances,
                );
              }}
            />
            <span>Title</span>
          </>
        ),
        Cell: ({ row }: CellProps<InstanceWithoutRelation>) => (
          <div className={classes.title}>
            <CheckboxInput
              label={
                <span className="u-off-screen">{`Toggle ${row.original.title} instance`}</span>
              }
              labelClassName="u-no-margin--bottom u-no-padding--top"
              checked={selectedInstances.some(
                ({ id }) => id === row.original.id,
              )}
              onChange={() => handleInstanceCheck(row.original)}
            />
            <Link
              to={`${ROOT_PATH}instances/${instance.id}/${row.original.id}`}
            >
              {row.original.title}
            </Link>
          </div>
        ),
      },
      {
        accessor: "distribution",
        Header: "OS",
        Cell: ({ row: { original } }: CellProps<InstanceWithoutRelation>) =>
          original.distribution
            ? `Ubuntu\xA0${original.distribution}`
            : "Unknown",
      },
      {
        accessor: "default",
        Header: "Default",
        Cell: ({ row }: CellProps<InstanceWithoutRelation>) => (
          <span>
            {row.original.title === instance.default_child ? "Yes" : "No"}
          </span>
        ),
      },
      {
        accessor: "actions",
        className: classes.actions,
        Header: "Actions",
        Cell: ({ row: { original } }: CellProps<InstanceWithoutRelation>) => (
          <WslInstanceListActions instance={original} parentId={instance.id} />
        ),
      },
    ],
    [wslInstances, selectedInstances],
  );

  return (
    <>
      <WslInstancesHeader
        resetQuery={() => setSearchQuery("")}
        selectedInstances={selectedInstances}
        setQuery={(newQuery) => setSearchQuery(newQuery)}
      />
      <ModularTable columns={columns} data={wslInstances} />
    </>
  );
};

export default WslInstanceList;
