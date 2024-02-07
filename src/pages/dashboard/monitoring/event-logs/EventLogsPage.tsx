import { FC } from "react";
import PageContent from "../../../../components/layout/PageContent";
import PageHeader from "../../../../components/layout/PageHeader";
import PageMain from "../../../../components/layout/PageMain";

const EventLogsPage: FC = () => {
  return (
    <PageMain>
      <PageHeader title="Event logs" />
      <PageContent>
        <div>Event logs</div>
      </PageContent>
    </PageMain>
  );
};

export default EventLogsPage;
