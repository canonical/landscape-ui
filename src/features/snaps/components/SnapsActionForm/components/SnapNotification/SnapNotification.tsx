import type { FC, ReactNode } from "react";
import { Notification } from "@canonical/react-components";
import type {
  ActionWithNotification,
  SnapAction,
  SnapChangeMode,
} from "../../../../types";
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

const SnapNotification: FC<SnapNotificationProps> = ({
  action,
  snapChangeConfigs,
}) => {
  const actionContent: Record<ActionWithNotification, ReactNode> = {
    hold: (
      <Notification
        severity="information"
        title="Landscape holds snaps indefinitely"
      >
        Due to Landscape’s asynchronous delivery of activities, the snaps held
        will be held indefinitely from the moment the client executes the
        activity.
      </Notification>
    ),
    install: (
      <Notification
        severity="information"
        title="Instances of multiple architectures selected"
      >
        The instances you selected are of more than one architecture. The snaps
        added will only be installed on compatible instances.
      </Notification>
    ),
    "change channel": (
      <Notification
        severity="information"
        title="Instances of multiple architectures selected"
      >
        The instances you selected are of more than one architecture. The change
        channel action will only be applied on compatible instances.
      </Notification>
    ),
  };

  const hasRevision =
    snapChangeConfigs &&
    Object.values(snapChangeConfigs).some(
      (config) => config.mode === "revision",
    );

  return (
    <>
      {hasNotification(action) && actionContent[action]}
      {hasRevision && (
        <Notification
          severity="information"
          actions={[
            {
              label: "Visit Snapd documentation",
              onClick: () => {
                window.open(
                  "https://snapcraft.io/docs/reference/development/snapd-rest-api/#/Asynchronous/manageSnapByName",
                  "_blank",
                );
              },
            },
          ]}
        >
          Specifying a revision doesn&apos;t change the tracked channel, so
          future updates may replace it with that channel&apos;s latest
          revision.
        </Notification>
      )}
    </>
  );
};

export default SnapNotification;
