import { cardClasses } from "@/components/layout/Card";
import useAuth from "@/hooks/useAuth";
import type { MultiSelectItem } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import type { Alert } from "../../types";
import AlertsTable from "../AlertsTable";
import classes from "./AlertsList.module.scss";

interface AlertsListProps {
  readonly alerts: Alert[];
  readonly availableTagOptions: MultiSelectItem[];
}

const AlertsList: FC<AlertsListProps> = ({ alerts, availableTagOptions }) => {
  const { user } = useAuth();
  const account = user?.accounts.find(
    (account) => account.name === user.current_account,
  );
  return (
    <div className={classNames(cardClasses.card, classes.card)}>
      <div className={cardClasses.header}>
        <p className={cardClasses.title}>{account?.title || "Alerts"}</p>
      </div>
      <div className={classNames(cardClasses.content, classes.content)}>
        <AlertsTable
          alerts={alerts}
          availableTagOptions={availableTagOptions}
        />
      </div>
    </div>
  );
};

export default AlertsList;
