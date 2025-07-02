import { distributionCardClasses, seriesCardClasses } from "@/features/mirrors";
import useAuth from "@/hooks/useAuth";
import type { MultiSelectItem } from "@canonical/react-components";
import type { FC } from "react";
import type { Alert } from "../../types";
import AlertsTable from "../AlertsTable";

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
    <div className={distributionCardClasses.item}>
      <div className={seriesCardClasses.card}>
        <div className={seriesCardClasses.header}>
          <p className={seriesCardClasses.title}>
            {account?.title || "Alerts"}
          </p>
        </div>
        <div className={seriesCardClasses.content}>
          <AlertsTable
            alerts={alerts}
            availableTagOptions={availableTagOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default AlertsList;
