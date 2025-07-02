import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageMain from "@/components/layout/PageMain";
import { AlertsList, useAlerts } from "@/features/alerts";
import useInstances from "@/hooks/useInstances";
import type { MultiSelectItem } from "@canonical/react-components";
import { PageHeader } from "@landscape/ui";
import type { FC } from "react";
import { useMemo } from "react";

const AlertsPage: FC = () => {
  const { getAlertsQuery } = useAlerts();
  const { getAllInstanceTagsQuery } = useInstances();

  const { data: getAllInstanceTagsQueryResult } = getAllInstanceTagsQuery();

  const { data: getAlertsQueryResult, isLoading } = getAlertsQuery();

  const alerts = useMemo(
    () =>
      getAlertsQueryResult?.data.filter(
        (alert) => !alert.alert_type.toUpperCase().includes("LICENSE"),
      ) ?? [],
    [getAlertsQueryResult],
  );

  const tagOptions: MultiSelectItem[] =
    getAllInstanceTagsQueryResult?.data.results.map((tag) => ({
      label: tag,
      value: tag,
      group: "Tags",
    })) ?? [];

  const availableTagOptions = [
    { label: "All instances", value: "All" },
    ...tagOptions,
  ];

  return (
    <PageMain>
      <PageHeader title="Alerts" />
      <PageContent>
        {isLoading && <LoadingState />}
        {!isLoading && alerts && (
          <AlertsList
            alerts={alerts}
            availableTagOptions={availableTagOptions}
          />
        )}
      </PageContent>
    </PageMain>
  );
};

export default AlertsPage;
