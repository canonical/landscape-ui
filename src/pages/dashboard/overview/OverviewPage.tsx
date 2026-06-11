import classNames from "classnames";
import type { FC } from "react";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  FleetHealthWidget,
  FleetTopIssues,
  HealthByGroup,
  RemediationPile,
  TopDetractors,
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

// LA061 Phase 1.8: three-row dashboard layout when the health flag is on.
//   Row 1: 2fr Fleet health (gauge + bands) | 1fr Top issues now
//   Row 2: 3 remediation cards (3 × 1fr, side by side inside RemediationPile)
//   Row 3: 1fr Health by group | 1fr Top detractors
const HealthDashboard: FC = () => {
  const summaryQuery = useFleetHealthSummary();
  const detractorsQuery = useFleetTopDetractors();
  const onRetry = () => {
    void summaryQuery.refetch();
    void detractorsQuery.refetch();
  };
  return (
    <div className={classes.healthDashboard}>
      <div className={classes.heroRow}>
        <FleetHealthWidget
          summary={summaryQuery.data?.data}
          isLoading={summaryQuery.isLoading}
          isError={summaryQuery.isError}
          onRetry={onRetry}
          isRetrying={summaryQuery.isFetching}
          hideTopDetractors
        />
        <FleetTopIssues
          detractors={detractorsQuery.data?.data.results}
          isLoading={detractorsQuery.isLoading}
        />
      </div>
      <RemediationPile />
      <div className={classes.splitRow}>
        <HealthByGroup />
        <TopDetractors />
      </div>
    </div>
  );
};

const OverviewPage: FC = () => {
  const { isFeatureEnabled } = useAuth();
  const healthEnabled = isFeatureEnabled("health");
  if (healthEnabled) {
    return (
      <PageMain>
        <PageHeader title="Overview" />
        <PageContent>
          <HealthDashboard />
          <InfoTablesContainer />
        </PageContent>
      </PageMain>
    );
  }
  return (
    <PageMain>
      <PageHeader title="Overview" />
      <PageContent>
        <div className={classNames(classes.container)}>
          <ChartContainer />
          <AlertsContainer />
        </div>
        <InfoTablesContainer />
      </PageContent>
    </PageMain>
  );
};

export default OverviewPage;
