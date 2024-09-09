import { FC, useMemo } from "react";
import { CellProps, Column } from "react-table";
import ExpandableTable from "@/components/layout/ExpandableTable";
import { Instance } from "@/types/Instance";
import { UsnPackage } from "@/types/Usn";
import { handleCellProps } from "./helpers";
import classes from "./UsnInstanceList.module.scss";

interface UsnInstanceListProps {
  instances: Instance[];
  limit: number;
  onLimitChange: () => void;
  usn: string;
  usnPackages: UsnPackage[];
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
