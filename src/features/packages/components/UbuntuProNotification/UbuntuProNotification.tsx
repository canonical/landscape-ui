import type { FC } from "react";
import { useNavigate, useParams } from "react-router";
import { Button, Notification } from "@canonical/react-components";
import type { UrlParams } from "@/types/UrlParams";
import { ROUTES } from "@/libs/routes";

const UbuntuProNotification: FC = () => {
  const navigate = useNavigate();
  const { instanceId, childInstanceId } = useParams<UrlParams>();
  return (
    <Notification severity="caution">
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
            ROUTES.instances.details.fromParams(
              { instanceId, childInstanceId },
              { tab: "ubuntu-pro" },
            ),
          );
        }}
      >
        Learn more
      </Button>
    </Notification>
  );
};

export default UbuntuProNotification;
