import type { FC } from "react";
import { lazy } from "react";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import SidePanel from "@/components/layout/SidePanel";
import usePageParams from "@/hooks/usePageParams";
import useSetDynamicFilterValidation from "@/hooks/useDynamicFilterValidation";
import { useGetPendingInstances } from "@/features/instances";
import {
  AlertsContainer,
  ChartContainer,
  InfoTablesContainer,
} from "@/features/overview";
import classes from "./OverviewPage.module.scss";

const PendingInstancesForm = lazy(
  () => import("@/pages/dashboard/instances/PendingInstancesForm"),
);

const OverviewPage: FC = () => {
  const { lastSidePathSegment, popSidePathUntilClear } = usePageParams();
  useSetDynamicFilterValidation("sidePath", ["review-pending-instances"]);

  const { pendingInstances } = useGetPendingInstances(undefined, {
    enabled: lastSidePathSegment === "review-pending-instances",
  });

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

      <SidePanel
        onClose={popSidePathUntilClear}
        isOpen={lastSidePathSegment === "review-pending-instances"}
        size="large"
      >
        {lastSidePathSegment === "review-pending-instances" && (
          <SidePanel.Suspense key="review-pending-instances">
            <SidePanel.Header>Review Pending Instances</SidePanel.Header>
            <SidePanel.Content>
              <PendingInstancesForm instances={pendingInstances} />
            </SidePanel.Content>
          </SidePanel.Suspense>
        )}
      </SidePanel>
    </PageMain>
  );
};

export default OverviewPage;
