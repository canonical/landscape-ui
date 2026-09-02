import { Modal } from "@canonical/react-components";
import type { FC } from "react";

interface AdministratorLimitModalProps {
  readonly close: () => void;
}

const AdministratorLimitModal: FC<AdministratorLimitModalProps> = ({
  close,
}) => {
  return (
    <Modal close={close} title="Administrator limit reached">
      <p>
        You have reached the maximum number of administrators. You must remove
        an administrator before you can invite a new one.
      </p>
      <p>
        Alternatively, you can reach out to support to request to increase your
        administrator limit.
      </p>
    </Modal>
  );
};

export default AdministratorLimitModal;
