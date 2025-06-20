import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import type { WindowsInstanceWithoutRelation } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";

interface WindowsInstanceMakeCompliantModalProps {
  readonly close: () => void;
  readonly instances: WindowsInstanceWithoutRelation[];
  readonly isOpen: boolean;
}

const WindowsInstanceMakeCompliantModal: FC<
  WindowsInstanceMakeCompliantModalProps
> = ({ close, instances, isOpen }) => {
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
      title={`Make ${title} compliant`}
      confirmButtonLabel="Make compliant"
      confirmButtonAppearance="negative"
      confirmButtonDisabled={false}
      confirmButtonLoading={false}
      confirmationText={`make ${title} compliant`}
      onConfirm={async () => undefined}
    >
      <p>
        This will:
        <ol>
          <li>
            Remove all child instances that haven’t been created by Landscape
          </li>
          <li>
            Install the instances according to the profiles the parent is
            associated with
          </li>
          <li>Reinstall instances that already exist but aren’t compliant</li>
        </ol>
      </p>
    </TextConfirmationModal>
  );
};

export default WindowsInstanceMakeCompliantModal;
