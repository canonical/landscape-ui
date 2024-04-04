import { STATUSES } from "@/pages/dashboard/instances/InstanceStatusLabel/constants";

const alerts = [
  "ComputerOfflineAlert",
  "ComputerOnlineAlert",
  "ComputerRebootAlert",
  "EsmDisabledAlert",
  "ComputerDuplicateAlert",
];

export const widgetAlerts = Object.values(STATUSES)
  .filter(({ alertType }) => alerts.includes(alertType))
  .sort((a, b) => alerts.indexOf(a.alertType) - alerts.indexOf(b.alertType));
