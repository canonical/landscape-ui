import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import { pluralize, pluralizeWithCount } from "@/utils/_helpers";

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
      title={`Upgrade ${pluralize(eligibleCount, "distribution")} for ${pluralizeWithCount(
        eligibleCount,
        "instance",
      )}`}
      confirmButtonLabel="Confirm"
      confirmButtonProps={{ type: "button" }}
      onConfirm={onConfirm}
      confirmButtonDisabled={isCreating}
      confirmButtonLoading={isCreating}
      renderInPortal
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
