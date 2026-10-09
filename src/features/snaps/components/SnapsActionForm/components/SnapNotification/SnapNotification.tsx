import type { FC } from "react";
import { Notification } from "@canonical/react-components";
import type { SnapAction, SnapChangeMode } from "../../../../types";
import { hasNotification } from "../../helpers";

interface SnapChangeConfig {
  mode: SnapChangeMode;
  value: string;
  channel?: string;
}

interface SnapNotificationProps {
  readonly action: SnapAction;
  readonly snapChangeConfigs?: Record<string, SnapChangeConfig>;
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
  snapChangeConfigs,
}) => {
  const hasRevision =
    snapChangeConfigs &&
    Object.values(snapChangeConfigs).some(
      (config) => config.mode === "revision",
    );

  return (
    <>
      {hasNotification(action) && <HoldNotification />}
      {hasRevision && (action === "install" || action === "change channel") && (
        <Notification
          severity="information"
          actions={[
            {
              label: "Visit Snapd documentation",
              onClick: () => {
                window.open(
                  "https://snapcraft.io/docs/reference/development/snapd-rest-api/#/Asynchronous/manageSnapByName",
                  "_blank",
                  "noopener,noreferrer",
                );
              },
            },
          ]}
        >
          {revisionMessages[action]}
        </Notification>
      )}
    </>
  );
};

export default SnapNotification;
