import React, { FC } from "react";
import { Notification } from "@canonical/react-components";
import { NotificationHelper } from "../../types/Notification";

type AppNotificationProps = {
  notify: NotificationHelper;
};

const AppNotification: FC<AppNotificationProps> = ({ notify }) => {
  if (!notify.notification) {
    return null;
  }

  const { type, message, actions } = notify.notification;

  return (
    <Notification
      severity={type}
      onDismiss={notify.clear}
      style={{
        marginTop: "2rem",
        marginBottom: "2rem",
      }}
      actions={actions}
    >
      {message}
    </Notification>
  );
};

export default AppNotification;
