import type { FC } from "react";
import { Notification } from "@canonical/react-components";
import type { ActionWithNotification } from "../../../../types";
import { useBoolean } from "usehooks-ts";

interface SnapNotificationProps {
  readonly action: ActionWithNotification;
}

const SnapNotification: FC<SnapNotificationProps> = ({ action }) => {
  const { value: isDismissed, setTrue: dismiss } = useBoolean(false);

  const content =
    action === "hold"
      ? {
          title: "Landscape holds snaps indefinitely",
          body: "Due to Landscape’s asynchronous delivery of activities, the snaps held will be held indefinitely from the moment the client executes the activity.",
        }
      : {
          title: "Instances of multiple architectures selected",
          body: "The instances you selected are of more than one architecture. The snaps added will only be installed on compatible instances.",
          onDismiss: dismiss,
        };

  if (isDismissed) {
    return null;
  }

  return (
    <Notification
      severity="information"
      title={content.title}
      onDismiss={content.onDismiss}
    >
      {content.body}
    </Notification>
  );
};

export default SnapNotification;
