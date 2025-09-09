import { useState } from "react";
import type { Notification, NotificationHelper } from "@/types/Notification";

const DEFAULT_NOTIFICATION_TIMEOUT = 5000;

const useNotificationHelper = (): NotificationHelper => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const setDeduplicated = (newValue: Notification | null) => {
    if (newValue?.message !== notification?.message) {
      setNotification(newValue);
    }
  };

  return {
    notification,

    error: ({ message, error, actions, title }) => {
      setDeduplicated({
        actions,
        error,
        message,
        title,
        type: "negative",
      });
    },

    info: ({ message, actions, title }) => {
      setDeduplicated({
        actions,
        message,
        title,
        type: "information",
      });
    },

    success: ({ message, actions, title }) => {
      setDeduplicated({
        actions,
        message,
        title,
        type: "positive",
      });

      setTimeout(() => {
        setNotification(null);
      }, DEFAULT_NOTIFICATION_TIMEOUT);
    },

    clear: () => {
      setNotification(null);
    },
  };
};

export default useNotificationHelper;
