import { ROOT_PATH } from "@/constants";
import { STATUSES } from "@/pages/dashboard/instances/InstanceStatusLabel/constants";
import { AlertSummary } from "@/types/Alert";
import { Link, List } from "@canonical/react-components";
import { FC } from "react";
import classes from "./AlertNotificationsList.module.scss";
import classNames from "classnames";

interface AlertsListProps {
  alerts: AlertSummary[];
}

const AlertsList: FC<AlertsListProps> = ({ alerts }) => {
  return (
    <List
      items={alerts.map((alert) => (
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
      ))}
    />
  );
};

export default AlertsList;
