import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { InstanceWithoutRelation } from "@/types/Instance";
import { pluralize, pluralizeArray } from "@/utils/_helpers";
import type { FC } from "react";
import { useRemoveInstancesFromLandscape } from "../../api";

interface InstanceRemoveFromLandscapeModalProps {
  readonly close: () => void;
  readonly instances: InstanceWithoutRelation[];
  readonly isOpen: boolean;
  readonly onSuccess?: () => void;
}

const InstanceRemoveFromLandscapeModal: FC<
  InstanceRemoveFromLandscapeModalProps
> = ({ close, instances, isOpen, onSuccess }) => {
  const debug = useDebug();
  const { notify } = useNotify();

  const { removeInstancesFromLandscape, isRemovingInstancesFromLandscape } =
    useRemoveInstancesFromLandscape();

  const label = pluralizeArray(
    instances,
    (instance) => instance.title,
    `instances`,
  );

  const removeFromLandscape = async () => {
    try {
      await removeInstancesFromLandscape({
        computer_ids: instances.map(({ id }) => id),
      });

      notify.success({
        title: `You have successfully removed ${label} from Landscape.`,
        message: pluralizeArray(
          instances,
          (instance) =>
            `${instance.title} has been removed from Landscape. To manage it again, you will need to re-register it in Landscape.`,
          `instances have been removed from Landscape. To manage them again, you will need to re-register them in Landscape.`,
        ),
      });

      onSuccess?.();
    } catch (error) {
      debug(error);
    } finally {
      close();
    }
  };

  return (
    <TextConfirmationModal
      isOpen={isOpen}
      close={close}
      title={`Remove ${label} from Landscape`}
      confirmButtonLabel="Remove"
      confirmButtonAppearance="negative"
      confirmButtonDisabled={isRemovingInstancesFromLandscape}
      confirmButtonLoading={isRemovingInstancesFromLandscape}
      confirmationText={`remove ${label}`}
      onConfirm={removeFromLandscape}
    >
      <p>
        {pluralize(
          instances.length,
          "This will delete all associated data and free up one license slot for another computer to be registered. You can re-register it to Landscape at any time.",
          `This will delete all associated data and free up ${instances.length} license slots for other computers to be registered. You can re-register them to Landscape at any time.`,
        )}
      </p>
    </TextConfirmationModal>
  );
};

export default InstanceRemoveFromLandscapeModal;
