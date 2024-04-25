import { Alert } from "@/types/Alert";

export const getSelectedAlerts = (
  alerts: Alert[],
  selected: string[],
): Alert[] => {
  return alerts.filter((alert) => selected.includes(alert.alert_type));
};
