import { FC } from "react";
import AlertCard from "../AlertCard";
import classes from "./AlertsContainer.module.scss";
import { widgetAlerts } from "./constants";

const AlertsContainer: FC = () => {
  return (
    <div className={classes.container}>
      {widgetAlerts.map((alert, index) => (
        <AlertCard key={index} alertQueryData={alert} />
      ))}
    </div>
  );
};

export default AlertsContainer;
