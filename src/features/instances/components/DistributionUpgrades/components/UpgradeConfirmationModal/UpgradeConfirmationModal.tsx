import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import { pluralize } from "@/utils/_helpers";

interface UpgradeConfirmationModalProps {
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly eligibleCount: number;
  readonly isCreating: boolean;
}

const UpgradeConfirmationModal: FC<UpgradeConfirmationModalProps> = ({
  onClose,
  onConfirm,
  eligibleCount,
  isCreating,
}) => {
  return (
    <ConfirmationModal
      close={onClose}
      title={`Upgrade ${pluralize(eligibleCount, "distribution")} for ${eligibleCount} ${pluralize(
        eligibleCount,
        "instance",
      )}`}
      confirmButtonLabel="Confirm"
      onConfirm={onConfirm}
      confirmButtonDisabled={isCreating}
    >
      <p>
        A reboot is required to complete this action. There is a risk that the{" "}
        {pluralize(eligibleCount, "instance")} will not be able to contact
        Landscape.
      </p>
    </ConfirmationModal>
  );
};

export default UpgradeConfirmationModal;
