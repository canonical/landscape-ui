import { ModularTable } from "@canonical/react-components";
import { FC, useState } from "react";
import { CellProps } from "react-table";
import { SidePanelTablePagination } from "@/components/layout/TablePagination";
import useAlerts from "@/hooks/useAlerts";
import { Alert, Subscriber } from "@/types/Alert";
import AlertButtons from "../AlertButtons";

interface AlertDetailsProps {
  alert: Alert;
}

const AlertDetails: FC<AlertDetailsProps> = ({ alert }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const { getAlertSubscribersQuery } = useAlerts();

  const { data, isLoading } = getAlertSubscribersQuery({
    alert_type: alert.alert_type,
  });
  const subscriberData = data?.data ?? [];

  const getSubscribers = (limit: number, offset: number) => {
    return subscriberData.slice(offset, offset + limit);
  };

  const subscribers = getSubscribers(pageSize, (currentPage - 1) * pageSize);

  const columns = [
    {
      accessor: "name",
      Header: () => "Subscribers",
      Cell: ({ row }: CellProps<Subscriber>) => row.original.name,
    },
  ];

  return (
    <>
      <AlertButtons sidePanel alerts={[alert]} />
      <ModularTable
        columns={columns}
        data={subscribers}
        emptyMsg={isLoading ? "Loading..." : "No subscribers found."}
        getCellProps={({ column }) => {
          switch (column.id) {
            case "name":
              return { "aria-label": "Name" };
            default:
              return {};
          }
        }}
      />
      <SidePanelTablePagination
        currentPage={currentPage}
        totalItems={subscriberData.length}
        currentItemCount={subscribers.length}
        paginate={(page) => {
          setCurrentPage(page);
        }}
        pageSize={pageSize}
        setPageSize={(itemsNumber) => {
          setPageSize(itemsNumber);
        }}
      />
    </>
  );
};

export default AlertDetails;
