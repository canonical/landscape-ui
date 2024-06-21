import { FC, useState } from "react";
import useAlerts from "@/hooks/useAlerts";
import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { SettingsAlertsList } from "@/features/account-settings/Alerts";

const AlertsPage: FC = () => {
  const { getAlertsQuery } = useAlerts();

  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);

  const { data: getAlertsQueryResult, isLoading } = getAlertsQuery();

  const alerts =
    getAlertsQueryResult?.data.filter(
      (alert) => !alert.alert_type.toUpperCase().includes("LICENSE"),
    ) ?? [];

  return (
    <PageMain>
      <PageHeader title="Alerts" />
      <PageContent>
        {isLoading && <LoadingState />}
        {!isLoading && alerts && (
          <SettingsAlertsList
            alerts={alerts}
            selectedAlerts={selectedAlerts}
            setSelectedAlerts={(items) => setSelectedAlerts(items)}
          />
        )}
      </PageContent>
    </PageMain>
  );
};

export default AlertsPage;
