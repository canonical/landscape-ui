import type { TextConfirmationModalProps } from "@/components/form/TextConfirmationModal";
import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useRemovalProfiles } from "../../hooks";
import type { RemovalProfile } from "../../types";

interface RemovalProfileRemoveModalProps extends Pick<
  TextConfirmationModalProps,
  "close" | "isOpen"
> {
  readonly removalProfile: RemovalProfile;
}

const RemovalProfileRemoveModal: FC<RemovalProfileRemoveModalProps> = ({
  close,
  isOpen,
  removalProfile,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { setPageParams } = usePageParams();

  const { removeRemovalProfileQuery } = useRemovalProfiles();
  const { mutateAsync: removeRemovalProfile, isPending: isRemoving } =
    removeRemovalProfileQuery;

  const handleRemovalProfileRemove = async () => {
    try {
      await removeRemovalProfile({ name: removalProfile.name });

      setPageParams({ sidePath: [], profile: "" });

      notify.success({
        title: "Removal profile removed",
        message: `Removal profile ${removalProfile.title} has been removed.`,
      });
    } catch (error) {
      debug(error);
    } finally {
      close();
    }
  };

  return (
    <TextConfirmationModal
      title={`Remove ${removalProfile.title}`}
      confirmationText={`remove ${removalProfile.title}`}
      confirmButtonLabel="Remove"
      confirmButtonAppearance="negative"
      confirmButtonLoading={isRemoving}
      onConfirm={handleRemovalProfileRemove}
      close={close}
      isOpen={isOpen}
    >
      <p>
        This will remove &quot;{removalProfile.title}&quot; profile. This action
        is <b>irreversible</b>.
      </p>
    </TextConfirmationModal>
  );
};

export default RemovalProfileRemoveModal;
