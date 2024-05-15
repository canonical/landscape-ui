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

interface AlertsListProps {
  alerts: AlertSummary[];
  pendingInstances: PendingInstance[];
}

const AlertsList: FC<AlertsListProps> = ({ alerts, pendingInstances }) => {
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
      <Link
        href={`${ROOT_PATH}instances?status=${STATUSES[alert.alert_type].filterValue}`}
        className={classNames(
          "u-no-margin u-no-padding",
          classes.listItem__link,
        )}
      >
        {alert.summary}
      </Link>
    </div>
  ));
  if (pendingInstances.length > 0) {
    listItems.push(
      <div className={classes.listItem}>
        <i className={`p-icon--${STATUSES.PendingComputers.icon.color}`} />
        <Button
          type="button"
          appearance="link"
          className="u-no-margin u-no-padding"
          onClick={handlePendingInstancesReview}
        >
          <span className={classes.instancesNumber}>
            {pendingInstances.length}
          </span>{" "}
          pending{" "}
          {pendingInstances.length !== 1
            ? "computers need "
            : "computer needs "}
          authorization
        </Button>
      </div>,
    );
  }
  return <List items={listItems} />;
};

export default AlertsList;
