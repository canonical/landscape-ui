import { Modal } from "@canonical/react-components";
import type { FC } from "react";

interface AdministratorLimitModalProps {
  readonly close: () => void;
  readonly isLimitError?: boolean;
}

const AdministratorLimitModal: FC<AdministratorLimitModalProps> = ({
  close,
  isLimitError = false,
}) => {
  const limitTexts = isLimitError
    ? {
        title: "Administrator limit cannot be determined",
        warning:
          "The administrator limit cannot be determined, so new invitations are temporarily disabled.",
        support: "Please try again later or contact our support team.",
      }
    : {
        title: "Administrator limit reached",
        warning:
          "You have reached the maximum number of administrators. You must remove an administrator before you can invite a new one.",
        support:
          "Alternatively, you can reach out to support to request an increase to your administrator limit.",
      };

  return (
    <Modal close={close} title={limitTexts.title}>
      <>
        <p>{limitTexts.warning}</p>
        <p>{limitTexts.support}</p>
      </>
    </Modal>
  );
};

export default AdministratorLimitModal;
