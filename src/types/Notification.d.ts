import { ValueOf } from "@canonical/react-components/dist/types";
import { NotificationSeverity } from "@canonical/react-components/dist/components/Notification/Notification";

declare type NotificationAction = {
  label: string;
  onClick: () => void;
};

export interface Notification {
  actions?: NotificationAction[];
  message: string;
  type: ValueOf<typeof NotificationSeverity>;
}

export interface NotificationHelper {
  notification: Notification | null;
  clear: () => void;
  error: (message: string, error?: any, actions?: NotificationAction[]) => void;
  info: (message: string, actions?: NotificationAction[]) => void;
  success: (message: string, actions?: NotificationAction[]) => void;
}
