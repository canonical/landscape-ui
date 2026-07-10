import { useEffect, useState } from "react";
import type { Notification, NotificationHelper } from "@/types/Notification";

const DEFAULT_NOTIFICATION_TIMEOUT = 5000;

const useNotificationHelper = (): NotificationHelper => {
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (!notification?.duration) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setNotification(null);
    }, notification.duration);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [notification]);

  return {
    notification,

    error: ({ message, error, actions, title }) => {
      setNotification({
        actions,
        error,
        message,
        title,
        type: "negative",
      });
    },

    info: ({ message, actions, title }) => {
      setNotification({
        actions,
        message,
        title,
        type: "information",
      });
    },

    success: ({ message, actions, title }) => {
      setNotification({
        actions,
        message,
        title,
        type: "positive",
        duration: DEFAULT_NOTIFICATION_TIMEOUT,
      });
    },

    clear: () => {
      setNotification(null);
    },
  };
};

export default useNotificationHelper;
