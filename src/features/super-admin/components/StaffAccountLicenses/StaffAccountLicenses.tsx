import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import date from "@/libs/date";
import type { FC, ReactNode } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import type { StaffAccountLicense } from "../../types";

const MIN_TABLE_WIDTH = 400;

interface StaffAccountLicensesProps {
  readonly licenses: StaffAccountLicense[];
}

const StaffAccountLicenses: FC<StaffAccountLicensesProps> = ({ licenses }) => {
  const columns = useMemo<Column<StaffAccountLicense>[]>(
    () => [
      { accessor: "type", Header: "Type" },
      { accessor: "seats", Header: "Seats" },
      {
        accessor: "expires",
        Header: "Expires",
        Cell: ({
          row: { original },
        }: CellProps<StaffAccountLicense>): ReactNode =>
          original.expires ? (
            <span className="font-monospace">
              {date(original.expires).format(DISPLAY_DATE_TIME_FORMAT)}
            </span>
          ) : (
            <NoData />
          ),
      },
    ],
    [],
  );

  return (
    <ResponsiveTable
      columns={columns}
      data={licenses}
      emptyMsg="This account has no licenses."
      minWidth={MIN_TABLE_WIDTH}
    />
  );
};

export default StaffAccountLicenses;
