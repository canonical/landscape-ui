import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { TablePagination } from "@/components/layout/TablePagination";
import type { AuthUser } from "@/features/auth";
import {
  EventsLogHeader,
  EventsLogList,
  useEventsLog,
} from "@/features/events-log";
import useAuth from "@/hooks/useAuth";
import usePageParams from "@/hooks/usePageParams";
import { Button } from "@canonical/react-components";
import moment from "moment";
import type { FC } from "react";
import { useMemo } from "react";
import { downloadCSV } from "./helpers";

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
        event.message.toLowerCase().includes(search.toLowerCase()),
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
            onClick={() => {
              downloadCSV(
                eventsLog,
                `Event Log - ${user.current_account}-${moment().format("YYYY-MM-DDTHH mm ss[Z]")}.csv`,
              );
            }}
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
