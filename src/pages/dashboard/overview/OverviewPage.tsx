import type { FC } from "react";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import {
  AlertsContainer,
  ChartContainer,
  InfoTablesContainer,
} from "@/features/overview";
import classes from "./OverviewPage.module.scss";

const OverviewPage: FC = () => {
  return (
    <PageMain>
      <PageHeader title="Overview" />
      <PageContent>
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
