import { FC, useMemo } from "react";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  EventsLogHeader,
  EventsLogList,
  useEventsLog,
} from "@/features/events-log";
import { Button } from "@canonical/react-components";
import { TablePagination } from "@/components/layout/TablePagination";
import useAuth from "@/hooks/useAuth";
import { AuthUser } from "@/features/auth";
import moment from "moment";
import { downloadCSV } from "./helpers";
import LoadingState from "@/components/layout/LoadingState";
import { usePageParams } from "@/hooks/usePageParams";

const EventsLogPage: FC = () => {
  const { days, search, currentPage, pageSize } = usePageParams();
  const { user } = useAuth() as { user: AuthUser };
  const { getEventsLog } = useEventsLog();

  const { data: eventsLogData, isLoading } = getEventsLog({
    days: Number(days),
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    search: search,
  });

  const eventsLog = useMemo(
    () =>
      eventsLogData?.data.results.filter((event) =>
        event.message.includes(search),
      ) ?? [],
    [eventsLogData, search],
  );

  return (
    <PageMain>
      <PageHeader
        title="Events log"
        actions={[
          <Button
            type="button"
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
        <EventsLogHeader />
        {isLoading && <LoadingState />}
        {!isLoading && eventsLog && <EventsLogList eventsLog={eventsLog} />}
        <TablePagination
          totalItems={eventsLogData?.data.count}
          currentItemCount={eventsLog.length}
        />
      </PageContent>
    </PageMain>
  );
};

export default EventsLogPage;
