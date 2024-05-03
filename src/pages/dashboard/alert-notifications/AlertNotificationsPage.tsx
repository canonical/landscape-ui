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
import useInstances from "@/hooks/useInstances";

const AlertNotificationsPage: FC = () => {
  const navigate = useNavigate();
  const { getAlertsSummaryQuery } = useAlerts();
  const { getPendingInstancesQuery } = useInstances();

  const { data: alertsSummaryData, isLoading } = getAlertsSummaryQuery();
  const {
    data: getPendingInstancesQueryResult,
    isLoading: getPendingInstancesQueryLoading,
  } = getPendingInstancesQuery(
    {},
    {
      enabled: !!alertsSummaryData?.data.alerts_summary.find(
        (alert) => alert.alert_type === "PendingComputersAlert",
      ),
    },
  );

  const alerts =
    alertsSummaryData?.data.alerts_summary.filter(
      (alert) => alert.alert_type !== "PendingComputersAlert",
    ) || [];
  const pendingInstances = getPendingInstancesQueryResult?.data || [];

  const getLoadingPending = () => {
    const hasPending = alertsSummaryData?.data.alerts_summary.find(
      (alert) => alert.alert_type === "PendingComputersAlert",
    );
    if (hasPending) {
      return getPendingInstancesQueryLoading;
    } else {
      return false;
    }
  };

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
        {!isLoading && !getLoadingPending() && alerts.length > 0 && (
          <AlertNotificationsList
            alerts={alerts}
            pendingInstances={pendingInstances}
          />
        )}
      </PageContent>
    </PageMain>
  );
};

export default AlertNotificationsPage;
