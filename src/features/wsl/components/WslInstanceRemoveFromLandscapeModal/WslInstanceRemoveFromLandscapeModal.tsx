import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useNotify from "@/hooks/useNotify";
import type { WslInstanceWithoutRelation } from "@/types/Instance";
import { pluralize } from "@/utils/_helpers";
import type { FC } from "react";

interface WslInstanceRemoveFromLandscapeModalProps {
  readonly close: () => void;
  readonly instances: WslInstanceWithoutRelation[];
  readonly isOpen: boolean;
}

const WslInstanceRemoveFromLandscapeModal: FC<
  WslInstanceRemoveFromLandscapeModalProps
> = ({ close, instances, isOpen }) => {
  const debug = useDebug();
  const { notify } = useNotify();

  const { removeInstancesQuery } = useInstances();

  const { mutateAsync: removeInstances, isPending: isRemoving } =
    removeInstancesQuery;

  const [instance] = instances;

  if (!instance) {
    return;
  }

  const title = pluralize(
    instances.length,
    instance.title,
    `${instances.length} instances`,
  );

  const removeFromLandscape = async () => {
    try {
      await removeInstances({
        computer_ids: instances.map(({ id }) => id),
      });

      notify.success({
        title: `You have successfully removed ${pluralize(instances.length, instances[0].title, `${instances.length} instances`)}`,
        message: `${pluralize(
          instances.length,
          `${title} has been removed from Landscape. To manage it again, you will need to re-register it in Landscape.`,
          `${title} have been removed from Landscape. To manage them again, you will need to re-register them in Landscape.`,
        )}`,
      });
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
      confirmButtonDisabled={isRemoving}
      confirmButtonLoading={isRemoving}
      confirmationText={`remove ${title}`}
      onConfirm={removeFromLandscape}
    >
      <p>
        {pluralize(
          instances.length,
          "This will remove this instance from Landscape. It will remain on the parent machine. You can re-register it to Landscape at any time.",
          "This will remove the selected instances from Landscape. They will remain on the parent machine. You can re-register them to Landscape at any time.",
        )}
      </p>
    </TextConfirmationModal>
  );
};

export default WslInstanceRemoveFromLandscapeModal;
