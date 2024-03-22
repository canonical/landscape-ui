import { FC } from "react";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import InfoTablesContainer from "@/features/overview/InfoTablesContainer";
import classes from "./OverviewPage.module.scss";
import { ChartContainer } from "@/features/overview";
import { AlertsContainer } from "@/features/overview";

const OverviewPage: FC = () => {
  return (
    <PageMain>
      <PageHeader title="Overview" />
      <PageContent>
        <div className={classes.chartAndAlertsContainer}>
          <ChartContainer />
          <AlertsContainer />
        </div>
        <InfoTablesContainer />
      </PageContent>
    </PageMain>
  );
};

export default OverviewPage;
