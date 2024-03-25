import { FC } from "react";
import { Button, Notification } from "@canonical/react-components";
import { ROOT_PATH } from "@/constants";
import { Instance } from "@/types/Instance";
import { useNavigate } from "react-router-dom";

interface UbuntuProNotificationProps {
  instance: Instance;
  onDismiss: () => void;
}

const UbuntuProNotification: FC<UbuntuProNotificationProps> = ({
  instance,
  onDismiss,
}) => {
  const navigate = useNavigate();

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
            `${ROOT_PATH}instances/${instance.parent ? `${instance.parent.hostname}/${instance.hostname}` : instance.hostname}`,
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
