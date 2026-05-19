import classNames from "classnames";
import type { FC } from "react";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  FleetHealthWidget,
  useFleetHealthSummary,
  useFleetTopDetractors,
} from "@/features/health";
import {
  AlertsContainer,
  ChartContainer,
  InfoTablesContainer,
} from "@/features/overview";
import useAuth from "@/hooks/useAuth";
import classes from "./OverviewPage.module.scss";

const FleetHealth: FC = () => {
  const summaryQuery = useFleetHealthSummary();
  const detractorsQuery = useFleetTopDetractors();
  return (
    <FleetHealthWidget
      summary={summaryQuery.data?.data}
      topDetractors={detractorsQuery.data?.data.results}
      isLoading={summaryQuery.isLoading}
      isError={summaryQuery.isError}
      onRetry={() => {
        void summaryQuery.refetch();
        void detractorsQuery.refetch();
      }}
      isRetrying={summaryQuery.isFetching || detractorsQuery.isFetching}
    />
  );
};

const OverviewPage: FC = () => {
  const { isFeatureEnabled } = useAuth();
  const healthEnabled = isFeatureEnabled("health");
  return (
    <PageMain>
      <PageHeader title="Overview" />
      <PageContent>
        <div
          className={classNames(classes.container, {
            [classes.healthContainer]: healthEnabled,
          })}
        >
          {healthEnabled ? <FleetHealth /> : <ChartContainer />}
          <AlertsContainer />
        </div>
        <InfoTablesContainer />
      </PageContent>
    </PageMain>
  );
};

export default OverviewPage;
