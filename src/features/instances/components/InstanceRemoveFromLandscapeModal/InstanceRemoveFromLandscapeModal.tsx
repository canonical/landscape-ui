import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { InstanceWithoutRelation } from "@/types/Instance";
import type { FC } from "react";
import { useRemoveInstancesFromLandscape } from "../../api";

interface InstanceRemoveFromLandscapeModalProps {
  readonly close: () => void;
  readonly instance: InstanceWithoutRelation;
  readonly isOpen: boolean;
  readonly onSuccess?: () => void;
}

const InstanceRemoveFromLandscapeModal: FC<
  InstanceRemoveFromLandscapeModalProps
> = ({ close, instance, isOpen, onSuccess }) => {
  const debug = useDebug();
  const { notify } = useNotify();

  const { removeInstancesFromLandscape, isRemovingInstancesFromLandscape } =
    useRemoveInstancesFromLandscape();

  const removeFromLandscape = async () => {
    try {
      await removeInstancesFromLandscape({
        computer_ids: [instance.id],
      });

      notify.success({
        title: `You have successfully removed ${instance.title} from Landscape.`,
        message: `${instance.title} has been removed from Landscape. To manage it again, you will need to re-register it in Landscape.`,
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
      title={`Remove ${instance.title} from Landscape`}
      confirmButtonLabel="Remove"
      confirmButtonAppearance="negative"
      confirmButtonDisabled={isRemovingInstancesFromLandscape}
      confirmButtonLoading={isRemovingInstancesFromLandscape}
      confirmationText={`remove ${instance.title}`}
      onConfirm={removeFromLandscape}
    >
      <p>
        This will delete all associated data and free up one license slot for
        another computer to be registered. You can re-register it to Landscape
        at any time.
      </p>
    </TextConfirmationModal>
  );
};

export default InstanceRemoveFromLandscapeModal;
