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
import type { FC } from "react";
import { Link } from "react-router";

const AlertNotificationsPage: FC = () => {
  const { alertsSummary, isGettingAlertsSummary } = useAlertsSummary();

  const hasPendingInstancesAlert = alertsSummary.some(
    (alert) => alert.alert_type === "PendingComputersAlert",
  );

  const { pendingInstances, isGettingPendingInstances } =
    useGetPendingInstances(undefined, {
      enabled: hasPendingInstancesAlert,
    });

  const isGettingAlerts =
    isGettingAlertsSummary ||
    (hasPendingInstancesAlert && isGettingPendingInstances);

  if (isGettingAlerts) {
    return <LoadingState />;
  }

  return (
    <PageMain>
      <PageHeader title="Alerts" />
      <PageContent>
        {!alertsSummary.length ? (
          <EmptyState
            title="No subscribed alerts found"
            icon="connected"
            body="You are not subscribed to any alerts yet."
            cta={[
              <Link
                key="go-to-alerts-page"
                to={ROUTES.account.alerts()}
                replace
                className="p-button--positive u-no-margin--bottom"
              >
                Go to alerts
              </Link>,
            ]}
          />
        ) : (
          <AlertNotificationsList
            alerts={alertsSummary}
            pendingInstances={pendingInstances}
          />
        )}
      </PageContent>
    </PageMain>
  );
};

export default AlertNotificationsPage;
