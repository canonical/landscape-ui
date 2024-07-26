import { FC, useMemo } from "react";
import { CellProps, Column } from "react-table";
import {
  CheckboxInput,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import NoData from "@/components/layout/NoData";
import { PendingInstance } from "@/types/Instance";
import { SelectOption } from "@/types/SelectOption";
import { getAccessGroup, getCellProps, getCreationTime } from "./helpers";
import classes from "./PendingInstanceList.module.scss";

interface PendingInstanceListProps {
  accessGroupOptions: SelectOption[];
  instances: PendingInstance[];
  onSelectedIdsChange: (value: number[]) => void;
  selectedIds: number[];
}

const PendingInstanceList: FC<PendingInstanceListProps> = ({
  accessGroupOptions,
  instances,
  onSelectedIdsChange,
  selectedIds,
}) => {
  const pendingInstances = useMemo(() => instances, [instances]);

  const columns = useMemo<Column<PendingInstance>[]>(
    () => [
      {
        accessor: "checkbox",
        className: classes.checkbox,
        Header: () => (
          <CheckboxInput
            label={<span className="u-off-screen">Toggle all instances</span>}
            inline
            checked={selectedIds.length === pendingInstances.length}
            indeterminate={
              selectedIds.length > 0 &&
              selectedIds.length < pendingInstances.length
            }
            onChange={() =>
              onSelectedIdsChange(
                selectedIds.length > 0
                  ? []
                  : pendingInstances.map(({ id }) => id),
              )
            }
          />
        ),
        Cell: ({ row: { original } }: CellProps<PendingInstance>) => (
          <CheckboxInput
            label={
              <span className="u-off-screen">{`Toggle ${original.title} instance`}</span>
            }
            inline
            checked={selectedIds.includes(original.id)}
            onChange={() =>
              onSelectedIdsChange(
                selectedIds.includes(original.id)
                  ? selectedIds.filter((id) => id !== original.id)
                  : [...selectedIds, original.id],
              )
            }
          />
        ),
      },
      {
        accessor: "title",
        Header: "name",
      },
      {
        accessor: "hostname",
        Header: "Hostname",
      },
      {
        accessor: "access_group",
        Header: "Access group",
        Cell: ({ row: { original } }: CellProps<PendingInstance>) =>
          getAccessGroup(accessGroupOptions, original.access_group),
      },
      {
        accessor: "client_tags",
        Header: "Tags",
        Cell: ({ row: { original } }: CellProps<PendingInstance>) =>
          original.client_tags.length ? (
            <Tooltip
              message={original.client_tags.join(", ")}
              positionElementClassName={classes.truncate}
            >
              {original.client_tags.join(", ")}
            </Tooltip>
          ) : (
            <NoData />
          ),
      },
      {
        accessor: "creation_time",
        Header: "Pending since",
        Cell: ({ row: { original } }: CellProps<PendingInstance>) => (
          <Tooltip
            message={getCreationTime(original.creation_time)}
            positionElementClassName={classes.truncate}
          >
            {getCreationTime(original.creation_time)}
          </Tooltip>
        ),
      },
    ],
    [pendingInstances, selectedIds.length],
  );

  return (
    <ModularTable
      columns={columns}
      data={pendingInstances}
      getCellProps={getCellProps}
    />
  );
};

export default PendingInstanceList;
