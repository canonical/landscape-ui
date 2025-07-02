import type { FC } from "react";
import { useMemo } from "react";
import type { Column } from "react-table";
import ExpandableTable from "@/components/layout/ExpandableTable";
import type { UsnPackage } from "@/types/Usn";
import UsnPackagesRemoveButton from "../UsnPackagesRemoveButton";
import { handleCellProps } from "./helpers";

interface UsnPackageListProps {
  readonly instanceTitle: string;
  readonly limit: number;
  readonly onLimitChange: () => void;
  readonly showRemoveButton: boolean;
  readonly usn: string;
  readonly usnPackages: UsnPackage[];
}

const UsnPackageList: FC<UsnPackageListProps> = ({
  instanceTitle,
  limit,
  onLimitChange,
  showRemoveButton,
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
      additionalCta={
        showRemoveButton && (
          <UsnPackagesRemoveButton instanceTitle={instanceTitle} usn={usn} />
        )
      }
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

export default UsnPackageList;
