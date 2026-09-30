import type { FC, ReactNode } from "react";
import { Notification } from "@canonical/react-components";
import type {
  ActionWithNotification,
  SnapAction,
  SnapChangeMode,
} from "../../../../types";
import { useBoolean } from "usehooks-ts";

interface SnapChangeConfig {
  mode: SnapChangeMode;
  value: string;
  channel?: string;
}
import type { ActionWithNotification } from "../../../../types";

interface SnapNotificationProps {
  readonly action: SnapAction;
  readonly snapChangeConfigs?: Record<string, SnapChangeConfig>;
}

const SnapNotification: FC<SnapNotificationProps> = ({
  action,
  snapChangeConfigs,
}) => {
  const { value: isArchitectureDismissed, setTrue: dismissArchitecture } =
    useBoolean(false);

  const actionContent: Record<
    Exclude<ActionWithNotification, "install" | "change channel">,
    ReactNode
  > = {
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
  };

  const hasRevision =
    snapChangeConfigs &&
    Object.values(snapChangeConfigs).some(
      (config) => config.mode === "revision",
    );

  const isArchitectureNotification =
    action === "install" || action === "change channel";

  if (isArchitectureNotification && isArchitectureDismissed && !hasRevision) {
    return null;
  }

  return (
    <>
      {action === "hold" && actionContent.hold}
      {isArchitectureNotification && !isArchitectureDismissed && (
        <Notification
          severity="information"
          title="Instance architecture compatibility"
          onDismiss={dismissArchitecture}
        >
          The {action} action will only be applied to instances whose
          architecture is supported by the selected channel.
        </Notification>
      )}
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
                  "noopener,noreferrer",
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
