import { STATUSES } from "@/pages/dashboard/instances/InstanceList/constants";

const overviewAlerts = [
  "ComputerOfflineAlert",
  "ComputerOnlineAlert",
  "ComputerRebootAlert",
  "EsmDisabledAlert",
  "ComputerDuplicateAlert",
];

export const widgetAlerts = Object.values(STATUSES)
  .filter(({ alertType }) => overviewAlerts.includes(alertType))
  .sort(
    (a, b) =>
      overviewAlerts.indexOf(a.alertType) - overviewAlerts.indexOf(b.alertType),
  );
