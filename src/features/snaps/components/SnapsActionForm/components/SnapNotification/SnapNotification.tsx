import type { FC, ReactNode } from "react";
import { Notification } from "@canonical/react-components";
import type {
  ActionWithNotification,
  SnapAction,
  SnapChangeMode,
} from "../../../../types";
import { useBoolean } from "usehooks-ts";
import { hasNotification } from "../../helpers";

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
