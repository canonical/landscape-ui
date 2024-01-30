import { ModularTable } from "@canonical/react-components";
import { FC, useState } from "react";
import { CellProps } from "react-table";
import TablePagination from "../../../../components/layout/TablePagination";
import useAlerts from "../../../../hooks/useAlerts";
import { Alert, Subscriber } from "../../../../types/Alert";
import ShowSubscribersPanelActionButtons from "./ShowSubscribersPanelActionButtons";

interface ShowSubscribersPanelProps {
  alert: Alert;
}

const ShowSubscribersPanel: FC<ShowSubscribersPanelProps> = ({ alert }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const { getAlertSubscribersQuery } = useAlerts();
  const { data, isLoading } = getAlertSubscribersQuery({
    alert_type: alert.alert_type,
  });
  const subscriberData = data?.data ?? [];

  const columns = [
    {
      accessor: "name",
      Header: () => "Subscribers",
      Cell: ({ row }: CellProps<Subscriber>) => row.original.name,
    },
  ];

  return (
    <>
      <ShowSubscribersPanelActionButtons alert={alert} />
      <ModularTable
        columns={columns}
        data={subscriberData}
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
      <TablePagination
        currentPage={currentPage}
        totalItems={subscriberData.length}
        paginate={(page) => {
          setCurrentPage(page);
        }}
        pageSize={itemsPerPage}
        setPageSize={(itemsNumber) => {
          setItemsPerPage(itemsNumber);
        }}
      />
    </>
  );
};

export default ShowSubscribersPanel;
