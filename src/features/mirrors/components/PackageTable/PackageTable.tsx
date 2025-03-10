import {
  CheckboxInput,
  ModularTable,
  Tooltip,
} from "@canonical/react-components";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useMemo, type FC } from "react";
import type { CellProps, Column, HeaderProps } from "react-table";
import type { FormattedPackage } from "../../types/FormattedPackage";
import classes from "./PackageTable.module.scss";

interface PackageTableProps {
  readonly isUpload: boolean;
  readonly packagesToShow: FormattedPackage[];
  readonly search: string;
  readonly selectedPackages: number[];
  readonly setSelectedPackages: Dispatch<SetStateAction<number[]>>;
}

const PackageTable: FC<PackageTableProps> = ({
  isUpload,
  packagesToShow,
  search,
  selectedPackages,
  setSelectedPackages,
}) => {
  const columns = useMemo<Column<FormattedPackage>[]>(
    () => [
      {
        accessor: "packageName",
        Header: ({ rows }: HeaderProps<FormattedPackage>): ReactNode =>
          isUpload ? (
            <>
              <CheckboxInput
                inline
                label={<span className="u-off-screen">Toggle all</span>}
                disabled={!rows.length}
                indeterminate={
                  !!selectedPackages.length &&
                  selectedPackages.length < rows.length
                }
                checked={
                  selectedPackages.length === rows.length &&
                  !!selectedPackages.length
                }
                onChange={() => {
                  setSelectedPackages((prevState) =>
                    prevState.length ? [] : rows.map((_, index) => index),
                  );
                }}
              />
              <span>Package</span>
            </>
          ) : (
            "Package"
          ),
        Cell: ({ row }: CellProps<FormattedPackage>): ReactNode =>
          isUpload ? (
            <CheckboxInput
              inline
              label={row.original.packageName}
              checked={selectedPackages.includes(row.index)}
              onChange={() => {
                setSelectedPackages((prevState) =>
                  prevState.includes(row.index)
                    ? prevState.filter(
                        (selectedPackage) => selectedPackage !== row.index,
                      )
                    : [...prevState, row.index],
                );
              }}
            />
          ) : (
            row.original.packageName
          ),
      },
      {
        accessor: "packageVersion",
        Header: "Version",
        getCellIcon: ({ row }: CellProps<FormattedPackage>): string | false =>
          row.original.difference ? "warning" : false,
        className: classes.version,
        Cell: ({ row }: CellProps<FormattedPackage>): ReactNode =>
          row.original.difference ? (
            <Tooltip
              position="top-center"
              message={
                "delete" === row.original.difference
                  ? "Package deleted"
                  : `Version differs\nfrom parent pocket.\nParent version:\n${row.original.newVersion}`
              }
            >
              <span>{row.original.packageVersion}</span>
            </Tooltip>
          ) : (
            row.original.packageVersion
          ),
      },
    ],
    [packagesToShow, selectedPackages.length],
  );

  return (
    <ModularTable
      columns={columns}
      data={packagesToShow}
      emptyMsg={
        search ? `No packages found with the search: "${search}".` : undefined
      }
      className={classes.content}
      getCellProps={({ column }) => {
        switch (column.id) {
          case "packageName":
            return { role: "rowheader" };
          case "packageVersion":
            return { "aria-label": "Version" };
          default:
            return {};
        }
      }}
    />
  );
};

export default PackageTable;
