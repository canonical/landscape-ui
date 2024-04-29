import { ROOT_PATH } from "@/constants";
import { STATUSES } from "@/pages/dashboard/instances/InstanceStatusLabel/constants";
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
      {STATUSES[alert.alert_type].icon}
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
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M5.5 3.02393H4V12.9917H5.5V3.02393ZM11.5 3.02393H10V12.9917H11.5V3.02393Z"
            fill="#24598F"
          />
        </svg>
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
