import useAuth from "@/hooks/useAuth";
import distributionCardClasses from "@/pages/dashboard/repositories/mirrors/DistributionCard/DistributionCard.module.scss";
import seriesCardClasses from "@/pages/dashboard/repositories/mirrors/SeriesCard.module.scss";
import { FC } from "react";
import AlertsTable from "../AlertsTable";
import { Alert } from "@/types/Alert";
import { MultiSelectItem } from "@canonical/react-components";

interface AlertsListProps {
  alerts: Alert[];
  availableTagOptions: MultiSelectItem[];
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
