import LoadingState from "@/components/layout/LoadingState";
import usePageParams from "@/hooks/usePageParams";
import { ROUTES } from "@/libs/routes";
import type { PendingInstance } from "@/types/Instance";
import { pluralizeWithCount } from "@/utils/_helpers";
import { Button, Icon, List } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { Link } from "react-router";
import type { AlertSummary } from "../../types";
import classes from "./AlertNotificationsList.module.scss";
import { getAlertStatus, getRouteParams } from "./helpers";

const PendingInstancesForm = lazy(
  () => import("@/pages/dashboard/instances/PendingInstancesForm"),
);

interface AlertNotificationsListProps {
  readonly alerts: AlertSummary[];
  readonly pendingInstances: PendingInstance[];
}

const AlertNotificationsList: FC<AlertNotificationsListProps> = ({
  alerts,
  pendingInstances,
}) => {
  const { createSidePathPusher } = usePageParams();

  const handlePendingInstancesReview = createSidePathPusher("review-pending-instances");

  const listItems = alerts.map((alert, index) => {
    const alertStatus = getAlertStatus(alert.alert_type);
    const routeParams = getRouteParams(alert);

    return (
      <div key={alertStatus.alertType || index} className={classes.listItem}>
        <Icon name={`${alertStatus.icon.color ?? alertStatus.icon.gray}`} />
        {alertStatus.alertType === "PendingComputersAlert" ? (
          <Button
            type="button"
            appearance="link"
            className="u-no-margin u-no-padding"
            onClick={handlePendingInstancesReview}
          >
            {pluralizeWithCount(
              pendingInstances.length,
              "pending computer needs",
              "pending computers need",
            )}{" "}
            authorization
          </Button>
        ) : (
          <Link
            to={ROUTES.instances.root(routeParams)}
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
