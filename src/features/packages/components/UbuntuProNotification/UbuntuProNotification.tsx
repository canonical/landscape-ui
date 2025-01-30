import type { FC } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Notification } from "@canonical/react-components";
import { ROOT_PATH } from "@/constants";
import type { UrlParams } from "@/types/UrlParams";

interface UbuntuProNotificationProps {
  readonly onDismiss: () => void;
}

const UbuntuProNotification: FC<UbuntuProNotificationProps> = ({
  onDismiss,
}) => {
  const navigate = useNavigate();
  const { instanceId, childInstanceId } = useParams<UrlParams>();
  return (
    <Notification severity="caution" onDismiss={onDismiss}>
      <strong>Some upgrades require Ubuntu Pro: </strong>
      <span>
        Your current Ubuntu package upgrades are limited. To unlock full
        upgrades, please upgrade to Ubuntu Pro.{" "}
      </span>
      <Button
        type="button"
        appearance="link"
        onClick={() => {
          navigate(
            `${ROOT_PATH}instances/${childInstanceId ? `${instanceId}/${childInstanceId}` : instanceId}`,
            {
              state: { tab: "ubuntu-pro" },
            },
          );
        }}
      >
        Learn more
      </Button>
    </Notification>
  );
};

export default UbuntuProNotification;
