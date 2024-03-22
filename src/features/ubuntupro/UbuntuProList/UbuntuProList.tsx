import { ModularTable } from "@canonical/react-components";
import { FC, useMemo } from "react";
import { CellProps, Column } from "react-table";
import classes from "./UbuntuProList.module.scss";
import { UbuntuProService } from "@/types/Instance";

interface UbuntuProServicesListProps {
  items?: UbuntuProService[];
}

const UbuntuProList: FC<UbuntuProServicesListProps> = ({ items }) => {
  const servicesData = useMemo(() => items, [items?.length]) ?? [];

  const columns = useMemo<Column<UbuntuProService>[]>(
    () => [
      {
        accessor: "name",
        Header: "Name",
      },
      {
        accessor: "entitled",
        Header: "Entitled",
      },
      {
        accessor: "status",
        Header: "Status",
        getCellIcon: ({ row }: CellProps<UbuntuProService>) =>
          row.original.status === "enabled"
            ? "status-succeeded-small"
            : "status-failed-small",
      },
      {
        accessor: "description",
        Header: "Description",
        className: classes.description,
      },
    ],
    [],
  );

  return (
    <>
      <span className="p-heading--5">Services</span>
      <ModularTable
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
