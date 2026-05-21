import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import {
  AlertNotificationsList,
  useAlertsSummary,
  type AlertSummary,
} from "@/features/alert-notifications";
import { useGetPendingInstances } from "@/features/instances";
import { ROUTES } from "@/libs/routes";
import type { PendingInstance } from "@/types/Instance";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy } from "react";
import { useNavigate } from "react-router";

const PendingInstancesForm = lazy(
  () => import("@/pages/dashboard/instances/PendingInstancesForm"),
);

const getAlertsContent = ({
  isLoading,
  alerts,
  pendingInstances,
  navigate,
}: {
  isLoading: boolean;
  alerts: AlertSummary[];
  pendingInstances: PendingInstance[];
  navigate: ReturnType<typeof useNavigate>;
}) => {
  if (isLoading) {
    return <LoadingState />;
  }

  if (!alerts.length) {
    return (
      <EmptyState
        title="No subscribed alerts found"
        icon="connected"
        body={<p>You are not subscribed to any alerts yet.</p>}
        cta={[
          <Button
            appearance="positive"
            key="go-to-alerts-page"
            onClick={() => navigate(ROUTES.account.alerts(), { replace: true })}
            type="button"
            aria-label="Go to alerts page"
          >
            Go to alerts
          </Button>,
        ]}
      />
    );
  }

  return (
    <AlertNotificationsList
      alerts={alerts}
      pendingInstances={pendingInstances}
    />
  );
};

const AlertNotificationsPage: FC = () => {
  const navigate = useNavigate();
  const { getAlertsSummaryQuery } = useAlertsSummary();
  const { lastSidePathSegment, popSidePathUntilClear } = usePageParams();

  useSetDynamicFilterValidation("sidePath", ["review-pending-instances"]);

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
  const isLoadingAlertsContent =
    getAlertsSummaryQueryLoading ||
    Boolean(hasPendingInstancesAlert && isGettingPendingInstances);
  const alertsContent = getAlertsContent({
    isLoading: isLoadingAlertsContent,
    alerts,
    pendingInstances,
    navigate,
  });

  return (
    <PageMain>
      <PageHeader title="Alerts" />
      <PageContent>{alertsContent}</PageContent>

      <SidePanel
        onClose={popSidePathUntilClear}
        isOpen={lastSidePathSegment === "review-pending-instances"}
        size="large"
      >
        {lastSidePathSegment === "review-pending-instances" && (
          <SidePanel.Suspense key="review-pending-instances">
            <SidePanel.Header>Review Pending Instances</SidePanel.Header>
            <SidePanel.Content>
              <PendingInstancesForm instances={pendingInstances} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default AlertNotificationsPage;
