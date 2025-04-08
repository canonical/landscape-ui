import { Notification } from "@canonical/react-components";
import type { ComponentProps, MouseEvent } from "react";
import { useState, type FC } from "react";
import IgnorableModal from "../IgnorableModal";

interface SecurityProfileAuditRetentionNotificationProps
  extends Omit<ComponentProps<typeof Notification>, "onDismiss"> {
  readonly hide: (event: MouseEvent<HTMLElement>) => void;
  readonly storageKey: string;
  readonly modalProps?: Omit<
    ComponentProps<typeof IgnorableModal>,
    "hideModal" | "hideNotification" | "ignore"
  >;
}

const IgnorableNotifcation: FC<
  SecurityProfileAuditRetentionNotificationProps
> = ({
  hide,
  modalProps = { confirmButtonLabel: undefined },
  storageKey,
  ...props
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const ignore = () => {
    localStorage.setItem(storageKey, "true");
  };

  return (
    <>
      {localStorage.getItem(storageKey) != "true" && (
        <Notification {...props} onDismiss={showModal} />
      )}

      {isModalVisible && (
        <IgnorableModal
          hideModal={hideModal}
          hideNotification={hide}
          ignore={ignore}
          {...modalProps}
        />
      )}
    </>
  );
};

export default IgnorableNotifcation;
