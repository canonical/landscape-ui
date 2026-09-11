import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { DISPLAY_DATE_FORMAT } from "@/constants";
import date from "@/libs/date";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { License } from "../../types";
import { ROUTES } from "@/libs/routes";
import { Link } from "react-router";
import { NO_DATA_TEXT } from "@/components/layout/NoData";

interface LicensesListProps {
  readonly licenses: License[];
}

const LicensesList: FC<LicensesListProps> = ({ licenses }) => {
  const columns = useMemo<Column<License>[]>(
    () => [
      {
        Header: "Expiration date",
        Cell: ({ row: { original: license } }: CellProps<License>) =>
          license.expiration_date
            ? date(license.expiration_date).utc().format(DISPLAY_DATE_FORMAT)
            : "Never",
      },
      {
        Header: "Seats used",
        Cell: ({ row: { original: license } }: CellProps<License>) =>
          license.used_seats === 0 ? (
            "0"
          ) : (
            <Link
              to={ROUTES.instances.root({ query: `license-id:${license.id}` })}
            >
              {license.used_seats}
            </Link>
          ),
      },
      {
        Header: "Seats free",
        Cell: ({ row: { original: license } }: CellProps<License>) =>
          license.available_seats,
      },
      {
        Header: "License type",
        Cell: ({ row: { original: license } }: CellProps<License>) =>
          license.license_type || NO_DATA_TEXT,
      },
    ],
    [],
  );

  return (
    <ResponsiveTable
      columns={columns}
      data={licenses}
      emptyMsg="No licenses found."
      minWidth={550}
    />
  );
};

export default LicensesList;
