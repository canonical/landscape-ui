import { useState } from "react";
import { Notification, NotificationHelper } from "../types/Notification";

const useNotificationHelper = (): NotificationHelper => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const setDeduplicated = (newValue: Notification | null) => {
    if (newValue?.message !== notification?.message) {
      setNotification(newValue);
    }
  };

  return {
    notification,

    error: (message, error, actions) =>
      setDeduplicated({
        actions,
        message: error ? `${message} ${error.toString()}` : message,
        type: "negative",
      }),

    info: (message, actions) =>
      setDeduplicated({
        actions,
        message,
        type: "information",
      }),

    success: (message, actions) =>
      setDeduplicated({
        actions,
        message,
        type: "positive",
      }),

    clear: () => setNotification(null),
  };
};

export default useNotificationHelper;
