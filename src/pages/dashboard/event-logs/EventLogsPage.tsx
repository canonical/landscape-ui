import { FC, useMemo, useState } from "react";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { EventLogsHeader, EventLogsList } from "@/features/event-logs";
import useEventLogs from "@/hooks/useEventLogs";
import useDebug from "@/hooks/useDebug";
import { Button } from "@canonical/react-components";
import TablePagination from "@/components/layout/TablePagination";
import useAuth from "@/hooks/useAuth";
import { AuthUser } from "@/context/auth";
import moment from "moment";
import { downloadCSV } from "./helpers";

const EventLogsPage: FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [dayFilter, setDayFilter] = useState<number>(7);

  const { user } = useAuth() as { user: AuthUser };
  const { getEventLogs } = useEventLogs();
  const debug = useDebug();
  const { data: eventLogsData, error } = getEventLogs({
    days: dayFilter,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: search,
  });

  if (error) {
    debug(error);
  }

  const eventLogs = useMemo(
    () =>
      eventLogsData?.data.results.filter((event) =>
        event.message.includes(search),
      ) ?? [],
    [eventLogsData, search],
  );

  const handlePaginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePageSizeChange = (itemsNumber: number) => {
    setPageSize(itemsNumber);
    handlePaginate(1);
  };

  const handleDayChange = (newDay: number) => {
    setDayFilter(newDay);
    setCurrentPage(1);
  };

  return (
    <PageMain>
      <PageHeader
        title="Event logs"
        actions={[
          <Button
            key="download-as-cv"
            onClick={() =>
              downloadCSV(
                eventLogs,
                `Event Log - ${user.current_account}-${moment().format("YYYY-MM-DDTHH mm ss[Z]")}.csv`,
              )
            }
          >
            Download as CSV
          </Button>,
        ]}
      />
      <PageContent>
        <EventLogsHeader
          setSearch={(newSearch) => setSearch(newSearch)}
          handleResetPage={() => setCurrentPage(1)}
          dayFilter={dayFilter}
          handleDayChange={handleDayChange}
        />
        <EventLogsList eventLogs={eventLogs} />
        <TablePagination
          currentPage={currentPage}
          totalItems={eventLogsData?.data.count}
          paginate={handlePaginate}
          pageSize={pageSize}
          setPageSize={handlePageSizeChange}
          currentItemCount={eventLogs.length}
        />
      </PageContent>
    </PageMain>
  );
};

export default EventLogsPage;
