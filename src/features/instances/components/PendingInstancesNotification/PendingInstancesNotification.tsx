import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { pluralize } from "@/utils/_helpers";
import { Button, Notification } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useGetPendingInstances } from "../../api";
import classes from "./PendingInstancesNotification.module.scss";

const PendingInstanceList = lazy(
  async () => import("@/pages/dashboard/instances/PendingInstancesForm"),
);

const PendingInstancesNotification: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const { pendingInstances } = useGetPendingInstances();

  if (!pendingInstances.length) {
    return null;
  }

  const handlePendingInstancesReview = () => {
    setSidePanelContent(
      "Review Pending Instances",
      <Suspense fallback={<LoadingState />}>
        <PendingInstanceList instances={pendingInstances} />
      </Suspense>,
      "large",
    );
  };

  return (
    <Notification
      severity="information"
      title="Pending instances"
      className={classes.notification}
    >
      <span>
        {`You currently have ${pendingInstances.length} pending
          	${pluralize(pendingInstances.length, "instance")}
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
