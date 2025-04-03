import { Notification } from "@canonical/react-components";
import type { ComponentProps } from "react";
import { useState, type FC } from "react";
import IgnorableModal from "../IgnorableModal";

interface SecurityProfileAuditRetentionNotificationProps
  extends Omit<ComponentProps<typeof Notification>, "onDismiss"> {
  readonly hide: () => void;
  readonly modalProps: Omit<
    ComponentProps<typeof IgnorableModal>,
    "hideModal" | "hideNotification" | "ignore"
  >;
  readonly storageKey: string;
}

const IgnorableNotifcation: FC<
  SecurityProfileAuditRetentionNotificationProps
> = ({ hide, modalProps, storageKey, ...props }) => {
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
      {!!localStorage.getItem(storageKey) && (
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
