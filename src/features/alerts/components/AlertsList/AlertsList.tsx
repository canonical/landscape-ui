import useAuth from "@/hooks/useAuth";
import { Card } from "@canonical/react-ds-global";
import type { MultiSelectItem } from "@canonical/react-components";
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
    <Card className={classes.card}>
      <Card.Header className={classes.header}>
        <strong>{account?.title || "Alerts"}</strong>
      </Card.Header>
      <Card.Content className={classes.content}>
        <AlertsTable
          alerts={alerts}
          availableTagOptions={availableTagOptions}
        />
      </Card.Content>
    </Card>
  );
};

export default AlertsList;
