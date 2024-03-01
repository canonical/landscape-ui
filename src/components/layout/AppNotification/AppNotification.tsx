import { FC } from "react";
import { Notification } from "@canonical/react-components";
import { NotificationHelper } from "@/types/Notification";
import classes from "./AppNotification.module.scss";
import classNames from "classnames";

type AppNotificationProps = {
  notify: NotificationHelper;
  isSidePanelOpen?: boolean;
};

const AppNotification: FC<AppNotificationProps> = ({
  notify,
  isSidePanelOpen = false,
}) => {
  if (!notify.notification) {
    return null;
  }

  const { type, message, actions, title } = notify.notification;

  return (
    <div className={classNames({ [classes.container]: !isSidePanelOpen })}>
      <Notification
        className={classNames(classes.baseNotificationStyle, {
          [classes.notification]: !isSidePanelOpen,
        })}
        severity={type}
        onDismiss={notify.clear}
        actions={actions}
        title={title}
      >
        {message}
      </Notification>
    </div>
  );
};

export default AppNotification;
