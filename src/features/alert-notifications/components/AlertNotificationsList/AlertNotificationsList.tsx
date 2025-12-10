import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { ROUTES } from "@/libs/routes";
import type { PendingInstance } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
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
            {`${pendingInstances.length} pending `}
            {pluralize(
              pendingInstances.length,
              "computer needs",
              "computers need",
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
