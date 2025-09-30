import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  AlertNotificationsList,
  useAlertsSummary,
} from "@/features/alert-notifications";
import { useGetPendingInstances } from "@/features/instances";
import { ROUTES } from "@/libs/routes";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { useNavigate } from "react-router";

const AlertNotificationsPage: FC = () => {
  const navigate = useNavigate();
  const { getAlertsSummaryQuery } = useAlertsSummary();

  const {
    data: getAlertsSummaryQueryResult,
    isLoading: getAlertsSummaryQueryLoading,
  } = getAlertsSummaryQuery();

  const hasPendingInstancesAlert =
    getAlertsSummaryQueryResult?.data.alerts_summary.some(
      (alert) => alert.alert_type === "PendingComputersAlert",
    );

  const { pendingInstances, isGettingPendingInstances } =
    useGetPendingInstances(undefined, {
      enabled: hasPendingInstancesAlert,
    });

  const alerts = getAlertsSummaryQueryResult?.data.alerts_summary || [];

  return (
    <PageMain>
      <PageHeader title="Alerts" />
      <PageContent>
        {getAlertsSummaryQueryLoading ||
        (hasPendingInstancesAlert && isGettingPendingInstances) ? (
          <LoadingState />
        ) : !alerts.length ? (
          <EmptyState
            title="No subscribed alerts found"
            icon="connected"
            body={<p>You are not subscribed to any alerts yet.</p>}
            cta={[
              <Button
                appearance="positive"
                key="go-to-alerts-page"
                onClick={() =>
                  navigate(ROUTES.account.alerts(), { replace: true })
                }
                type="button"
                aria-label="Go to alerts page"
              >
                Go to alerts
              </Button>,
            ]}
          />
        ) : (
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
