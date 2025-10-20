import { ALERT_STATUSES } from "@/features/instances";

const overviewAlerts = [
  "ComputerOfflineAlert",
  "ComputerOnlineAlert",
  "ComputerRebootAlert",
  "EsmDisabledAlert",
  "ComputerDuplicateAlert",
  "PendingComputersAlert",
];

export const widgetAlerts = Object.values(ALERT_STATUSES)
  .filter(({ alertType }) => overviewAlerts.includes(alertType))
  .sort(
    (a, b) =>
      overviewAlerts.indexOf(a.alertType) - overviewAlerts.indexOf(b.alertType),
  );
