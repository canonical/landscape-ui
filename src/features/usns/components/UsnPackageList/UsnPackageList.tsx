import type { FC } from "react";
import { useMemo } from "react";
import type { Column } from "react-table";
import ExpandableTable from "@/components/layout/ExpandableTable";
import LoadingState from "@/components/layout/LoadingState";
import type { UsnPackage } from "@/types/Usn";
import UsnPackagesRemoveButton from "../UsnPackagesRemoveButton";
import { handleCellProps } from "./helpers";

interface UsnPackageListProps {
  readonly instanceTitle: string;
  readonly isLoading?: boolean;
  readonly limit: number;
  readonly onLimitChange: () => void;
  readonly showRemoveButton: boolean;
  readonly usn: string;
  readonly usnPackages: UsnPackage[];
}

const UsnPackageList: FC<UsnPackageListProps> = ({
  instanceTitle,
  isLoading = false,
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

  // The USN list fetches packages on-demand only after the row expands,
  // so we don't know the package count up front and can't gate the
  // "Show packages" button on it. Render the heading as a visual anchor
  // and switch the body between loading / empty / table so the expanded
  // section never appears as a bare spinner or a headers-only table.
  const heading = (
    <p className="p-heading--4">
      Packages affected by <b>{usn}</b>
    </p>
  );

  if (isLoading) {
    return (
      <>
        {heading}
        <LoadingState />
      </>
    );
  }

  if (usnPackages.length === 0) {
    return (
      <>
        {heading}
        <p className="u-text--muted u-no-margin--bottom">
          No packages are currently affected by this USN.
        </p>
      </>
    );
  }

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
      title={heading}
      totalCount={usnPackages.length}
      getCellProps={handleCellProps}
    />
  );
};

export default UsnPackageList;
