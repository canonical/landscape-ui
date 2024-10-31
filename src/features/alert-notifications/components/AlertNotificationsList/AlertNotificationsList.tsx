import { ROOT_PATH } from "@/constants";
import { STATUSES } from "@/features/instances";
import { AlertSummary } from "@/types/Alert";
import { Button, Icon, List } from "@canonical/react-components";
import { FC, lazy, Suspense } from "react";
import classes from "./AlertNotificationsList.module.scss";
import classNames from "classnames";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";
import { PendingInstance } from "@/types/Instance";
import { Link } from "react-router-dom";

const PendingInstancesForm = lazy(
  () => import("@/pages/dashboard/instances/PendingInstancesForm"),
);

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

  const listItems = alerts.map((alert, index) => {
    const status = STATUSES[alert.alert_type] || STATUSES.Unknown;

    return (
      <div key={status.alertType || index} className={classes.listItem}>
        <Icon name={`${status.icon.color ?? status.icon.gray}`} />
        {status.alertType === "PendingComputersAlert" ? (
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
            to={`${ROOT_PATH}instances?status=${status.filterValue}`}
            className={classNames(
              "u-no-margin u-no-padding",
              classes.listItem__link,
            )}
          >
            {alert.summary}
          </Link>
        )}
      </div>
    );
  });

  return <List items={listItems} />;
};

export default AlertNotificationsList;
