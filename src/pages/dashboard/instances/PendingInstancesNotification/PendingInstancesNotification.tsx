import { FC, lazy, Suspense } from "react";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import { Button, Notification } from "@canonical/react-components";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";

const PendingInstanceList = lazy(
  () => import("@/pages/dashboard/instances/PendingInstancesForm"),
);

const PendingInstancesNotification: FC = () => {
  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();
  const { getPendingInstancesQuery } = useInstances();

  const {
    data: getPendingInstancesQueryResult,
    error: getPendingInstancesQueryError,
  } = getPendingInstancesQuery();

  if (getPendingInstancesQueryError) {
    debug(getPendingInstancesQueryError);
  }

  if (
    !getPendingInstancesQueryResult ||
    !getPendingInstancesQueryResult.data.length
  ) {
    return null;
  }

  const handlePendingInstancesReview = () => {
    setSidePanelContent(
      "Review Pending Instances",
      <Suspense fallback={<LoadingState />}>
        <PendingInstanceList instances={getPendingInstancesQueryResult.data} />
      </Suspense>,
      "large",
    );
  };

  return (
    <Notification severity="information" title="Pending instances">
      <span>
        {`You currently have ${getPendingInstancesQueryResult.data.length} pending
          	${getPendingInstancesQueryResult.data.length > 1 ? "instances" : "instance"}
          	awaiting your review and approval. `}
      </span>
      <Button
        type="button"
        appearance="link"
        onClick={handlePendingInstancesReview}
      >
        Review Pending Instances
      </Button>
    </Notification>
  );
};

export default PendingInstancesNotification;
