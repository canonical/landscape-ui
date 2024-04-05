import { FC } from "react";
import useAlerts from "../../../../hooks/useAlerts";
import useDebug from "../../../../hooks/useDebug";
import LoadingState from "../../../../components/layout/LoadingState";
import AlertList from "./AlertList";

interface AlertsContainerProps {
  selectedAlerts: string[];
  setSelectedAlerts: (alerts: string[]) => void;
}

const AlertsContainer: FC<AlertsContainerProps> = ({
  selectedAlerts,
  setSelectedAlerts,
}) => {
  const debug = useDebug();
  const { getAlertsQuery } = useAlerts();
  const {
    data: getAlertsQueryResult,
    error: alertsError,
    isLoading: getAlertsQueryLoading,
  } = getAlertsQuery();
  if (alertsError) {
    debug(alertsError);
  }
  const alerts =
    getAlertsQueryResult?.data.filter(
      (alert) => !alert.alert_type.toUpperCase().includes("LICENSE"),
    ) ?? [];

  return getAlertsQueryLoading ? (
    <LoadingState />
  ) : (
    <AlertList
      alerts={alerts}
      selectedAlerts={selectedAlerts}
      setSelectedAlerts={(items) => {
        setSelectedAlerts(items);
      }}
    />
  );
};

export default AlertsContainer;
