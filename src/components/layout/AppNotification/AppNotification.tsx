import type { FC } from "react";
import { Notification } from "@canonical/react-components";
import type { NotificationHelper } from "@/types/Notification";
import classes from "./AppNotification.module.scss";
import classNames from "classnames";
import { CONTACT_SUPPORT_TEAM_MESSAGE } from "@/constants/constants";

interface AppNotificationProps {
  readonly notify: NotificationHelper;
  readonly isSidePanelOpen?: boolean;
}

const AppNotification: FC<AppNotificationProps> = ({
  notify,
  isSidePanelOpen = false,
}) => {
  if (!notify.notification) {
    return null;
  }

  const { type, message, actions, title } = notify.notification;

  const defaultMessage =
    type === "negative" ? CONTACT_SUPPORT_TEAM_MESSAGE : "Success";

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
        {message || defaultMessage}
      </Notification>
    </div>
  );
};

export default AppNotification;
