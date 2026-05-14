import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import ExpandableTable from "@/components/layout/ExpandableTable";
import type { Instance } from "@/types/Instance";
import type { UsnPackage } from "@/types/Usn";
import { handleCellProps } from "./helpers";
import classes from "./UsnInstanceList.module.scss";

interface UsnInstanceListProps {
  readonly instances: Instance[];
  readonly limit: number;
  readonly onLimitChange: () => void;
  readonly usn: string;
  readonly usnPackages: UsnPackage[];
}

const UsnInstanceList: FC<UsnInstanceListProps> = ({
  instances,
  limit,
  onLimitChange,
  usn,
  usnPackages,
}) => {
  const affectedComputerIds = useMemo(
    () => usnPackages.flatMap(({ computer_ids }) => computer_ids),
    [usnPackages],
  );

  const allFilteredInstances = useMemo(
    () => instances.filter(({ id }) => affectedComputerIds.includes(id)),
    [instances, affectedComputerIds],
  );

  const instanceData = useMemo(
    () => allFilteredInstances.slice(0, limit),
    [allFilteredInstances, limit],
  );

  const columns = useMemo<Column<Instance>[]>(
    () => [
      {
        accessor: "title",
        Header: "Name",
      },
      {
        accessor: "upgrades.security",
        className: classes.security,
        Header: "Affected packages",
        Cell: ({ row: { original } }: CellProps<Instance>) =>
          usnPackages.filter(({ computer_ids }) =>
            computer_ids.includes(original.id),
          ).length,
      },
    ],
    [instanceData.length],
  );

  return (
    <ExpandableTable
      columns={columns}
      data={instanceData}
      itemNames={{ plural: "instances", singular: "instance" }}
      onLimitChange={onLimitChange}
      totalCount={allFilteredInstances.length}
      title={
        <p className="p-heading--4">
          Instances affected by <b>{usn}</b>
        </p>
      }
      getCellProps={handleCellProps}
    />
  );
};

export default UsnInstanceList;
