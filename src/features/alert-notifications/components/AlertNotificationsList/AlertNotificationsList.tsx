import { ROOT_PATH } from "@/constants";
import { STATUSES } from "@/pages/dashboard/instances/InstanceList/constants";
import { AlertSummary } from "@/types/Alert";
import { Button, Link, List } from "@canonical/react-components";
import { FC, Suspense } from "react";
import classes from "./AlertNotificationsList.module.scss";
import classNames from "classnames";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";
import PendingInstancesForm from "@/pages/dashboard/instances/PendingInstancesForm";
import { PendingInstance } from "@/types/Instance";

interface AlertNotificationsListProps {
  alerts: AlertSummary[];
  pendingInstances: PendingInstance[];
}

const AlertNotificationsList: FC<AlertNotificationsListProps> = ({
  alerts,
  pendingInstances,
}) => {
  const { setSidePanelContent } = useSidePanel();

  const handlePendingInstancesReview = () => {
    setSidePanelContent(
      "Review Pending Instances",
      <Suspense fallback={<LoadingState />}>
        <PendingInstancesForm instances={pendingInstances} />
      </Suspense>,
      "large",
    );
  };

  const listItems = alerts.map((alert) => (
    <div key={alert.alert_type} className={classes.listItem}>
      <i className={`p-icon--${STATUSES[alert.alert_type].icon.color}`} />
      {alert.alert_type === "PendingComputersAlert" ? (
        <Button
          type="button"
          appearance="link"
          className="u-no-margin u-no-padding"
          onClick={handlePendingInstancesReview}
        >
          {`${pendingInstances.length} pending `}
          {pendingInstances.length !== 1
            ? "computers need "
            : "computer needs "}
          authorization
        </Button>
      ) : (
        <Link
          href={`${ROOT_PATH}instances?status=${STATUSES[alert.alert_type].filterValue}`}
          className={classNames(
            "u-no-margin u-no-padding",
            classes.listItem__link,
          )}
        >
          {alert.summary}
        </Link>
      )}
    </div>
  ));

  return <List items={listItems} />;
};

export default AlertNotificationsList;
