import { FC } from "react";
import AlertCard from "../AlertCard";
import classes from "./AlertsContainer.module.scss";
import { widgetFilterOptions } from "./constants";

interface AlertsContainerProps {}

const AlertsContainer: FC<AlertsContainerProps> = () => {
  return (
    <div className={classes.container}>
      {widgetFilterOptions.map((alert, index) => (
        <AlertCard key={index} alertQueryData={alert} />
      ))}
    </div>
  );
};

export default AlertsContainer;
