import usePageParams from "@/hooks/usePageParams";
import { pluralize } from "@/utils/_helpers";
import { Button, Notification } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useGetPendingInstances } from "../../api";
import classes from "./PendingInstancesNotification.module.scss";

const PendingInstancesNotification: FC = () => {
  const { createSidePathPusher } = usePageParams();

  const { pendingInstances } = useGetPendingInstances();

  const { value: dismissed, setTrue: dismiss } = useBoolean();

  if (!pendingInstances.length || dismissed) {
    return null;
  }

  const handlePendingInstancesReview = createSidePathPusher(
    "review-pending-instances",
  );

  return (
    <Notification
      severity="information"
      title="Pending instances"
      className={classes.notification}
      onDismiss={dismiss}
    >
      <span>
        You currently have{" "}
        {pluralize(pendingInstances.length, ["pending instance"], "exact")}{" "}
        awaiting your review and approval.{" "}
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
