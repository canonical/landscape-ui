import { Modal } from "@canonical/react-components";
import type { FC } from "react";
import { Button } from "@canonical/react-components";

interface AdministratorLimitModalProps {
  readonly close: () => void;
  readonly isAdminInfoError?: boolean;
}

const AdministratorLimitModal: FC<AdministratorLimitModalProps> = ({
  close,
  isAdminInfoError = false,
}) => {
  const limitTexts = isAdminInfoError
    ? {
        title: "Remaining invitations cannot be determined",
        warning:
          "We couldn't determine the number of invitations still available for this account, so new invitations are temporarily disabled.",
        support: "Please try again later or contact our support team.",
      }
    : {
        title: "Administrator limit reached",
        warning:
          "You have reached the maximum number of administrators. To invite a new one, you must remove an existing administrator or revoke an unclaimed invitation.",
        support:
          "Alternatively, you can reach out to support to request an increase to your administrator limit.",
      };

  return (
    <Modal
      close={close}
      title={limitTexts.title}
      buttonRow={<Button onClick={close}>Close</Button>}
    >
      <>
        <p className="u-margin--bottom">{limitTexts.warning}</p>
        <p className="u-margin--bottom">{limitTexts.support}</p>
      </>
    </Modal>
  );
};

export default AdministratorLimitModal;
