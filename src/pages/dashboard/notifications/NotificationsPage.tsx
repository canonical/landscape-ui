import { FC } from "react";
import PageContent from "../../../components/layout/PageContent";
import PageHeader from "../../../components/layout/PageHeader";
import PageMain from "../../../components/layout/PageMain";

const NotificationsPage: FC = () => {
  return (
    <PageMain>
      <PageHeader title="Notifications" />
      <PageContent>
        <div>Notifications</div>
      </PageContent>
    </PageMain>
  );
};

export default NotificationsPage;
