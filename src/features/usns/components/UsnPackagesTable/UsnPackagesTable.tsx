import type { FC, ReactNode } from "react";
import { useMemo } from "react";
import type { Column } from "react-table";
import ExpandableTable from "@/components/layout/ExpandableTable";
import type { UsnPackage } from "@/types/Usn";
import { handleCellProps } from "../UsnPackageList/helpers";

interface UsnPackagesTableProps {
  readonly additionalCta?: ReactNode;
  readonly limit: number;
  readonly onLimitChange: () => void;
  readonly usn: string;
  readonly usnPackages: UsnPackage[];
}

const UsnPackagesTable: FC<UsnPackagesTableProps> = ({
  additionalCta,
  limit,
  onLimitChange,
  usn,
  usnPackages,
}) => {
  const packageSlice = useMemo(
    () => usnPackages.slice(0, limit),
    [limit, usnPackages],
  );

  const columns = useMemo<Column<UsnPackage>[]>(
    () => [
      {
        accessor: "name",
        Header: "Package",
      },
      {
        accessor: "current_version",
        Header: "Current version",
      },
      {
        accessor: "new_version",
        Header: "New version",
      },
      {
        accessor: "summary",
        Header: "Details",
      },
    ],
    [packageSlice.length],
  );

  return (
    <ExpandableTable
      additionalCta={additionalCta}
      columns={columns}
      data={packageSlice}
      itemNames={{ plural: "packages", singular: "package" }}
      onLimitChange={onLimitChange}
      title={
        <p className="p-heading--4">
          Packages affected by <b>{usn}</b>
        </p>
      }
      totalCount={usnPackages.length}
      getCellProps={handleCellProps}
    />
  );
};

export default UsnPackagesTable;
