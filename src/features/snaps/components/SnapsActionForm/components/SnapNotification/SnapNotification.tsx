import type { FC } from "react";
import { Notification } from "@canonical/react-components";
import type { ActionWithNotification } from "../../../../types";

interface SnapNotificationProps {
  readonly action: ActionWithNotification;
}

const SnapNotification: FC<SnapNotificationProps> = ({ action }) => {
  const content =
    action === "hold"
      ? {
          title: "Landscape holds snaps indefinitely",
          body: "Due to Landscape’s asynchronous delivery of activities, the snaps held will be held indefinitely from the moment the client executes the activity.",
          onDismiss: undefined,
        }
      : {
          title: undefined,
          body: "Specifying a revision doesn't change the tracked channel, so future updates may replace it with that channel's latest revision.",
        };

  return (
    <Notification severity="information" title={content.title}>
      {content.body}
    </Notification>
  );
};

export default SnapNotification;
