import { ValueOf } from "@canonical/react-components/dist/types";
import { NotificationSeverity } from "@canonical/react-components/dist/components/Notification/Notification";

declare type NotificationAction = {
  label: string;
  onClick: () => void;
};

export interface Notification {
  message: string;
  type: ValueOf<typeof NotificationSeverity>;
  actions?: NotificationAction[];
  error?: unknown;
  title?: string;
}

type NotificationMethodArgs<T extends "default" | "error" = "default"> =
  T extends "error"
    ? {
        message: string;
        actions?: NotificationAction[];
        error?: unknown;
        title?: string;
      }
    : {
        message: string;
        actions?: NotificationAction[];
        title?: string;
      };

type NotificationMethod<T = "default"> = (
  args: NotificationMethodArgs<T>,
) => void;

export interface NotificationHelper {
  clear: () => void;
  error: NotificationMethod<"error">;
  info: NotificationMethod;
  notification: Notification | null;
  success: NotificationMethod;
}
