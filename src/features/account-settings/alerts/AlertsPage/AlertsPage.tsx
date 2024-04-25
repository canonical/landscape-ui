import { FC, useState } from "react";
import useAlerts from "@/hooks/useAlerts";
import useDebug from "@/hooks/useDebug";
import classes from "./AlertsPage.module.scss";
import AlertsList from "../AlertsList";
import LoadingState from "@/components/layout/LoadingState";
import AlertButtons from "../AlertButtons";
import { getSelectedAlerts } from "./helpers";
const AlertsPage: FC = () => {
  const debug = useDebug();
  const { getAlertsQuery } = useAlerts();

  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);

  const {
    data: getAlertsQueryResult,
    error: alertsError,
    isLoading,
  } = getAlertsQuery();

  if (alertsError) {
    debug(alertsError);
  }

  const alerts =
    getAlertsQueryResult?.data.filter(
      (alert) => !alert.alert_type.toUpperCase().includes("LICENSE"),
    ) ?? [];

  return (
    <>
      <div className={classes.titleRow}>
        <h2 className="p-heading--4 u-no-margin--bottom u-no-padding--top">
          Alerts
        </h2>
        <AlertButtons
          alerts={getSelectedAlerts(alerts, selectedAlerts)}
          setSelectedAlerts={(items) => setSelectedAlerts(items)}
        />
      </div>

      {isLoading ? (
        <LoadingState />
      ) : (
        <AlertsList
          alerts={alerts}
          selectedAlerts={selectedAlerts}
          setSelectedAlerts={(items) => setSelectedAlerts(items)}
        />
      )}
    </>
  );
};

export default AlertsPage;
