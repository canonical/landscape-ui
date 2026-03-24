import type { NotificationProps } from "@canonical/react-components";

declare interface NotificationAction {
  label: string;
  onClick: () => void;
}

export interface Notification {
  message: string;
  type: NotificationProps["severity"];
  actions?: NotificationAction[];
  error?: unknown;
  title?: string;
}

export type NotificationMethodArgs<T extends "default" | "error" = "default"> =
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

type NotificationMethod<T extends "default" | "error" = "default"> = (
  args: NotificationMethodArgs<T>,
) => void;

export interface NotificationHelper {
  clear: () => void;
  error: NotificationMethod<"error">;
  info: NotificationMethod;
  notification: Notification | null;
  success: NotificationMethod;
}
