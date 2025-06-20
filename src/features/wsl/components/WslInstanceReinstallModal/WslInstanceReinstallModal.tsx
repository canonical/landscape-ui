import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import type { WslInstanceWithoutRelation } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";

interface WslInstanceReinstallModalProps {
  readonly close: () => void;
  readonly instances: WslInstanceWithoutRelation[];
  readonly isOpen: boolean;
}

const WslInstanceReinstallModal: FC<WslInstanceReinstallModalProps> = ({
  close,
  instances,
  isOpen,
}) => {
  const [instance] = instances;

  if (!instance) {
    return;
  }

  const title = pluralize(
    instances.length,
    instance.title,
    `${instances.length} instances`,
  );

  return (
    <TextConfirmationModal
      isOpen={isOpen}
      close={close}
      title={`Reinstall ${title}`}
      confirmButtonLabel="Reinstall"
      confirmButtonAppearance="negative"
      confirmButtonDisabled={false}
      confirmButtonLoading={false}
      confirmationText={`reinstall ${title}`}
      onConfirm={async () => undefined}
    >
      <p>
        {pluralize(
          instances.length,
          "This will uninstall this instance and create a new one with the same name that is compliant with its profiles.",
          "This will uninstall the selected instances and create new ones with the same names that are compliant with their profiles.",
        )}
      </p>
    </TextConfirmationModal>
  );
};

export default WslInstanceReinstallModal;
