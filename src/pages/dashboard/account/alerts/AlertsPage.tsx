import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { AlertsList, useAlerts } from "@/features/alerts";
import { useGetTags } from "@/features/tags";
import type { MultiSelectItem } from "@canonical/react-components";
import type { FC } from "react";
import { useMemo } from "react";

const AlertsPage: FC = () => {
  const { getAlertsQuery } = useAlerts();

  const { tags } = useGetTags();

  const { data: getAlertsQueryResult, isLoading } = getAlertsQuery();

  const alerts = useMemo(
    () =>
      getAlertsQueryResult?.data.filter(
        (alert) => !alert.alert_type.toUpperCase().includes("LICENSE"),
      ) ?? [],
    [getAlertsQueryResult],
  );

  const tagOptions: MultiSelectItem[] =
    tags.map((tag) => ({
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
      <PageContent hasTable>
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
