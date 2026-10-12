import type { FC } from "react";
import { Notification } from "@canonical/react-components";
import { SNAPD_REST_API_DOCUMENTATION_URL } from "@/constants";
import type {
  ActionWithNotification,
  SnapAction,
  SnapMode,
} from "../../../../types";

interface SnapChangeConfig {
  mode: SnapMode;
  value: string;
  channel?: string;
}

interface SnapNotificationProps {
  readonly action: ActionWithNotification;
  readonly snapModeConfigs?: Record<string, SnapChangeConfig>;
}

const HoldNotification = () => (
  <Notification
    severity="information"
    title="Landscape holds snaps indefinitely"
  >
    Due to Landscape’s asynchronous delivery of activities, the snaps held will
    be held indefinitely from the moment the client executes the activity.
  </Notification>
);

const revisionMessages: Record<
  Extract<SnapAction, "install" | "change channel">,
  string
> = {
  install:
    "Specifying a revision doesn't set a tracked channel, so future updates may replace it with the store's latest revision.",
  "change channel":
    "Specifying a revision doesn't change the tracked channel, so future updates may replace it with that channel's latest revision.",
};

const SnapNotification: FC<SnapNotificationProps> = ({
  action,
  snapModeConfigs,
}) => {
  if (action === "hold") {
    return <HoldNotification />;
  }

  const hasRevision =
    snapModeConfigs &&
    Object.values(snapModeConfigs).some((config) => config.mode === "revision");

  if (!hasRevision) {
    return null;
  }

  return (
    <Notification
      severity="information"
      actions={[
        {
          label: "Visit Snapd documentation",
          onClick: () => {
            window.open(
              SNAPD_REST_API_DOCUMENTATION_URL,
              "_blank",
              "noopener,noreferrer",
            );
          },
        },
      ]}
    >
      {revisionMessages[action]}
    </Notification>
  );
};

export default SnapNotification;
