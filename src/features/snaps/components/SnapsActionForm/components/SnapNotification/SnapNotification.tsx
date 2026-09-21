import type { FC } from "react";
import { Notification } from "@canonical/react-components";

interface SnapNotificationProps {
  readonly action: "hold" | "install";
}

const SnapNotification: FC<SnapNotificationProps> = ({ action }) => {
  const content =
    action === "hold"
      ? {
          title: "Landscape holds snaps indefinitely",
          body: "Due to Landscape’s asynchronous delivery of activities, the snaps held will be held indefinitely from the moment the client executes the activity.",
        }
      : {
          title: "Instances of multiple architectures selected",
          body: "The instances you selected are of more than one architecture. The snaps added will only be installed on compatible instances.",
        };

  return (
    <Notification severity="information" title={content.title}>
      {content.body}
    </Notification>
  );
};

export default SnapNotification;
