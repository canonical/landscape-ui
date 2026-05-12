import type { FC } from "react";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import { FleetHealthWidget, useFleetHealthSummary } from "@/features/health";
import {
  AlertsContainer,
  ChartContainer,
  InfoTablesContainer,
} from "@/features/overview";
import useAuth from "@/hooks/useAuth";
import classes from "./OverviewPage.module.scss";

const FleetHealth: FC = () => {
  const { isFeatureEnabled } = useAuth();
  const healthEnabled = isFeatureEnabled("health");
  const { data, isLoading, isError } = useFleetHealthSummary();
  if (!healthEnabled) return null;
  return (
    <FleetHealthWidget
      summary={data?.data}
      isLoading={isLoading}
      isError={isError}
    />
  );
};

const OverviewPage: FC = () => {
  return (
    <PageMain>
      <PageHeader title="Overview" />
      <PageContent>
        <FleetHealth />
        <div className={classes.container}>
          <ChartContainer />
          <AlertsContainer />
        </div>
        <InfoTablesContainer />
      </PageContent>
    </PageMain>
  );
};

export default OverviewPage;
