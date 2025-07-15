import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import { useRemoveInstancesFromLandscape } from "@/features/instances";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { InstanceChild } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";

interface WslInstanceRemoveFromLandscapeModalProps {
  readonly close: () => void;
  readonly instances: InstanceChild[];
  readonly isOpen: boolean;
  readonly onSuccess?: () => void;
}

const WslInstanceRemoveFromLandscapeModal: FC<
  WslInstanceRemoveFromLandscapeModalProps
> = ({ close, instances, isOpen, onSuccess }) => {
  const debug = useDebug();
  const { notify } = useNotify();

  const { removeInstancesFromLandscape, isRemovingInstancesFromLandscape } =
    useRemoveInstancesFromLandscape();

  const [instance] = instances;

  if (!instance) {
    return;
  }

  const title = pluralize(
    instances.length,
    instance.name,
    `${instances.length} instances`,
  );

  const removeFromLandscape = async () => {
    try {
      if (instances.some(({ computer_id }) => computer_id === null)) {
        return;
      }

      await removeInstancesFromLandscape({
        computer_ids: instances.map(({ computer_id }) => computer_id as number),
      });

      notify.success({
        title: `You have successfully removed ${title} from Landscape.`,
        message: `${pluralize(
          instances.length,
          `${title} has been removed from Landscape. To manage it again, you will need to re-register it in Landscape.`,
          `${title} have been removed from Landscape. To manage them again, you will need to re-register them in Landscape.`,
        )}`,
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
      title={`Remove ${title} from Landscape`}
      confirmButtonLabel="Remove"
      confirmButtonAppearance="negative"
      confirmButtonDisabled={isRemovingInstancesFromLandscape}
      confirmButtonLoading={isRemovingInstancesFromLandscape}
      confirmationText={`remove ${title}`}
      onConfirm={removeFromLandscape}
    >
      <p>
        {pluralize(
          instances.length,
          "This will delete all associated data and free up one license slot for another computer to be registered. It will remain on the parent machine. You can re-register it to Landscape at any time.",
          "This will delete all associated data and free up license slots for other computers to be registered. They will remain on the parent machine. You can re-register them to Landscape at any time.",
        )}
      </p>
    </TextConfirmationModal>
  );
};

export default WslInstanceRemoveFromLandscapeModal;
