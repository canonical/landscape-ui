import { Notification } from "@canonical/react-components";
import type { FC } from "react";
import ViewLogsButton from "../ViewLogsButton";

interface OperationErrorNotificationProps {
  readonly isVisible: boolean;
  readonly title: string;
  readonly message: string;
}

const OperationErrorNotification: FC<OperationErrorNotificationProps> = ({
  isVisible,
  title,
  message,
}) => {
  return (
    <div aria-live="polite" aria-relevant="additions">
      {isVisible && (
        <Notification
          severity="negative"
          title={title}
          actions={[<ViewLogsButton key="view-logs" />]}
        >
          {message}
        </Notification>
      )}
    </div>
  );
};

export default OperationErrorNotification;
