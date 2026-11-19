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
} from "@/features/health";
import {
  AlertsContainer,
  ChartContainer,
  InfoTablesContainer,
} from "@/features/overview";
import useAuth from "@/hooks/useAuth";
import { Cards } from "@canonical/react-ds-global";
import classes from "./OverviewPage.module.scss";

const HealthDashboard: FC = () => {
  const summaryQuery = useFleetHealthSummary();
  const onRetry = () => {
    void summaryQuery.refetch();
  };
  return (
    <div className={classNames("grid", classes.healthDashboard)}>
      <Cards>
        <FleetHealthWidget
          className={classes.twoThirds}
          summary={summaryQuery.data?.data}
          isLoading={summaryQuery.isLoading}
          isError={summaryQuery.isError}
          onRetry={onRetry}
          isRetrying={summaryQuery.isFetching}
        />
        <FleetTopIssues
          className={classes.third}
          issues={summaryQuery.data?.data.top_issues}
          isLoading={summaryQuery.isLoading}
        />
        <RemediationPile
          className={classes.third}
          fullWidthClassName={classes.full}
        />
        <HealthByGroup className={classes.half} />
        <TopDetractors className={classes.half} />
      </Cards>
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
