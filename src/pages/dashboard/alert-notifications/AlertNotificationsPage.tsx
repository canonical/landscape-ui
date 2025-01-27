import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { ROOT_PATH } from "@/constants";
import {
  AlertNotificationsList,
  useAlertsSummary,
} from "@/features/alert-notifications";
import useInstances from "@/hooks/useInstances";
import { Button } from "@canonical/react-components";
import { FC } from "react";
import { useNavigate } from "react-router";

const AlertNotificationsPage: FC = () => {
  const navigate = useNavigate();
  const { getAlertsSummaryQuery } = useAlertsSummary();
  const { getPendingInstancesQuery } = useInstances();

  const {
    data: getAlertsSummaryQueryResult,
    isLoading: getAlertsSummaryQueryLoading,
  } = getAlertsSummaryQuery();

  const {
    data: getPendingInstancesQueryResult,
    isLoading: getPendingInstancesQueryLoading,
  } = getPendingInstancesQuery(undefined, {
    enabled: !!getAlertsSummaryQueryResult?.data.alerts_summary.find(
      (alert) => alert.alert_type === "PendingComputersAlert",
    ),
  });

  const alerts = getAlertsSummaryQueryResult?.data.alerts_summary || [];
  const pendingInstances = getPendingInstancesQueryResult?.data || [];
  const isLoading =
    getAlertsSummaryQueryLoading || getPendingInstancesQueryLoading;

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
                  navigate(`${ROOT_PATH}account/alerts`, { replace: true })
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
