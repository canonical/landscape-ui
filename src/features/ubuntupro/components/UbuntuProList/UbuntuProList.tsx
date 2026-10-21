import NoData from "@/components/layout/NoData";
import ResponsiveTable from "@/components/layout/ResponsiveTable";
import type { UbuntuProService } from "@/types/Instance";
import type { FC } from "react";
import { useMemo } from "react";
import type { CellProps, Column } from "react-table";
import classes from "./UbuntuProList.module.scss";

interface UbuntuProServicesListProps {
  readonly services: UbuntuProService[];
  readonly simulated?: boolean;
}

const UbuntuProList: FC<UbuntuProServicesListProps> = ({
  services,
  simulated = false,
}) => {
  const servicesData = useMemo(() => services, [services.length]) ?? [];
  const columns = useMemo<Column<UbuntuProService>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
      },
      {
        accessor: "entitled",
        Header: "Entitled",
        Cell: ({ row }: CellProps<UbuntuProService>) => (
          <>{row.original.entitled ?? <NoData />}</>
        ),
      },
      simulated
        ? {
            accessor: "auto_enabled",
            Header: "Auto enabled",
            Cell: ({ row }: CellProps<UbuntuProService>) => (
              <>{row.original.auto_enabled ?? <NoData />}</>
            ),
          }
        : {
            accessor: "status",
            Header: "Status",
            Cell: ({ row }: CellProps<UbuntuProService>) => (
              <>{row.original.status ?? <NoData />}</>
            ),
            getCellIcon: ({
              row: { original },
            }: CellProps<UbuntuProService>) => {
              if (!original.status) {
                return null;
              }
              return original.status === "enabled"
                ? "status-succeeded-small"
                : "status-failed-small";
            },
          },
      {
        accessor: "description",
        Header: "Description",
        className: classes.description,
      },
    ],
    [simulated],
  );

  return (
    <>
      <span className="p-heading--5">Services</span>
      <ResponsiveTable
        columns={columns}
        data={servicesData}
        getCellProps={({ column }) => {
          switch (column.id) {
            case "name":
              return { role: "rowheader" };
            case "entitled":
              return { "aria-label": "Entitled" };
            case "status":
              return { "aria-label": "Status" };
            case "auto_enabled":
              return { "aria-label": "Auto enabled" };
            case "description":
              return { "aria-label": "Description" };
            default:
              return {};
          }
        }}
        emptyMsg="You have no services."
      />
    </>
  );
};

export default UbuntuProList;
