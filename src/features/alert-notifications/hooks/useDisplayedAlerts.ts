import { useGetPendingInstances } from "@/features/instances";
import useAlertsSummary from "./useAlertsSummary";

export default function useDisplayedAlerts() {
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

  return {
    alerts: alertsSummary,
    alertsCount: alertsSummary.length,
    pendingInstances,
    isGettingAlerts,
  };
}
