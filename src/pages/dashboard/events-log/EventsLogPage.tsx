import { FC, useMemo, useState } from "react";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { EventsLogHeader, EventsLogList } from "@/features/events-log";
import useEventsLog from "@/hooks/useEventLogs";
import useDebug from "@/hooks/useDebug";
import { Button } from "@canonical/react-components";
import TablePagination from "@/components/layout/TablePagination";
import useAuth from "@/hooks/useAuth";
import { AuthUser } from "@/context/auth";
import moment from "moment";
import { downloadCSV } from "./helpers";
import LoadingState from "@/components/layout/LoadingState";

const EventsLogPage: FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [dayFilter, setDayFilter] = useState<number>(7);

  const { user } = useAuth() as { user: AuthUser };
  const { getEventsLog } = useEventsLog();
  const debug = useDebug();
  const {
    data: eventsLogData,
    isLoading,
    error,
  } = getEventsLog({
    days: dayFilter,
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: search,
  });

  if (error) {
    debug(error);
  }

  const eventsLog = useMemo(
    () =>
      eventsLogData?.data.results.filter((event) =>
        event.message.includes(search),
      ) ?? [],
    [eventsLogData, search],
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
        title="Events log"
        actions={[
          <Button
            key="download-as-cv"
            onClick={() =>
              downloadCSV(
                eventsLog,
                `Event Log - ${user.current_account}-${moment().format("YYYY-MM-DDTHH mm ss[Z]")}.csv`,
              )
            }
          >
            Download as CSV
          </Button>,
        ]}
      />
      <PageContent>
        <EventsLogHeader
          setSearch={(newSearch) => setSearch(newSearch)}
          handleResetPage={() => setCurrentPage(1)}
          dayFilter={dayFilter}
          handleDayChange={handleDayChange}
        />
        {isLoading ? <LoadingState /> : <EventsLogList eventsLog={eventsLog} />}
        <TablePagination
          currentPage={currentPage}
          totalItems={eventsLogData?.data.count}
          paginate={handlePaginate}
          pageSize={pageSize}
          setPageSize={handlePageSizeChange}
          currentItemCount={eventsLog.length}
        />
      </PageContent>
    </PageMain>
  );
};

export default EventsLogPage;
