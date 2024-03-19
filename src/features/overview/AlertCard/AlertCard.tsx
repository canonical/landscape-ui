import { FC } from "react";
import classes from "./AlertCard.module.scss";
import { Button, Spinner } from "@canonical/react-components";
import classNames from "classnames";
import useInstances from "@/hooks/useInstances";
import { Link } from "react-router-dom";
import { ROOT_PATH } from "@/constants";

interface AlertCardProps {
  alertQueryData: {
    label: string;
    value: string;
    icon: string;
  };
}

const AlertCard: FC<AlertCardProps> = ({ alertQueryData }) => {
  const { getInstancesQuery } = useInstances();
  const { data: alertsData, isLoading } = getInstancesQuery({
    query: alertQueryData.value,
    limit: 1,
    root_only: false,
  });
  const isDataLoaded = !isLoading && alertsData && alertsData.data.count >= 0;
  return (
    <div className={classes.container}>
      <div className={classes.title}>
        <i className={`p-icon--${alertQueryData.icon}`} />
        <p className="p-heading--5 u-no-padding u-no-margin">
          {alertQueryData.label}
        </p>
      </div>
      <Button
        appearance="link"
        className={classNames("u-no-padding u-no-margin", classes.button)}
      >
        {isDataLoaded ? (
          <Link to={`${ROOT_PATH}instances?status=${alertQueryData.value}`}>
            <span className={classes.text}>{alertsData?.data.count}</span>{" "}
            instances
          </Link>
        ) : (
          <Spinner />
        )}
      </Button>
    </div>
  );
};

export default AlertCard;
