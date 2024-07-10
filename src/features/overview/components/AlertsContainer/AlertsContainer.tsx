import { FC } from "react";
import AlertCard from "../AlertCard";
import classes from "./AlertsContainer.module.scss";
import { widgetAlerts } from "./constants";

const AlertsContainer: FC = () => {
  return (
    <div className={classes.container}>
      {widgetAlerts.map((alert) => (
        <AlertCard key={alert.alertType} {...alert} />
      ))}
    </div>
  );
};

export default AlertsContainer;
