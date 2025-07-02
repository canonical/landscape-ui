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
  const instanceData = useMemo(
    () =>
      instances
        .filter(({ id }) =>
          usnPackages.flatMap(({ computer_ids }) => computer_ids).includes(id),
        )
        .slice(0, limit),
    [instances, limit, usnPackages],
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
      totalCount={instanceData.length}
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
