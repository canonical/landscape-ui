import { FC } from "react";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { AlertNotificationsList } from "@/features/alert-notifications";
import useAlerts from "@/hooks/useAlerts";
import LoadingState from "@/components/layout/LoadingState";
import EmptyState from "@/components/layout/EmptyState";
import { Button } from "@canonical/react-components";
import { ROOT_PATH } from "@/constants";
import { useNavigate } from "react-router-dom";

const AlertNotificationsPage: FC = () => {
  const navigate = useNavigate();
  const { getAlertsSummaryQuery } = useAlerts();
  const { data: alertsSummaryData, isLoading } = getAlertsSummaryQuery();
  const alerts = alertsSummaryData?.data.alerts_summary || [];
  return (
    <PageMain>
      <PageHeader title="Alerts" />
      <PageContent>
        {isLoading && <LoadingState />}
        {!isLoading && alerts.length === 0 && (
          <EmptyState
            title="No subscribed alerts found"
            icon="connected"
            body={<p>You are not subscribed to any alerts yet</p>}
            cta={[
              <Button
                appearance="positive"
                key="go-to-alerts-page"
                onClick={() =>
                  navigate(`${ROOT_PATH}settings/alerts`, { replace: true })
                }
                type="button"
                aria-label="Go to alerts page"
              >
                Go to alerts
              </Button>,
            ]}
          />
        )}
        {!isLoading && alerts.length > 0 && (
          <AlertNotificationsList alerts={alerts} />
        )}
      </PageContent>
    </PageMain>
  );
};

export default AlertNotificationsPage;
