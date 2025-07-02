import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import useNotify from "@/hooks/useNotify";
import type { FC } from "react";
import { useArchiveScriptProfile } from "../../api";
import type { ScriptProfile } from "../../types";

interface ScriptProfileArchiveModalProps {
  readonly profile: ScriptProfile;
  readonly removeProfile: () => void;
}

const ScriptProfileArchiveModal: FC<ScriptProfileArchiveModalProps> = ({
  profile,
  removeProfile,
}) => {
  const { notify } = useNotify();

  const { archiveScriptProfile, isArchivingScriptProfile } =
    useArchiveScriptProfile();

  const closeArchivingModal = () => {
    removeProfile();
  };

  const confirmArchiving = async () => {
    await archiveScriptProfile({ ...profile });

    closeArchivingModal();

    notify.success({
      title: `You have successfully archived "${profile.title}"`,
      message: "The profile will no longer run on the defined schedule.",
    });
  };

  return (
    <TextConfirmationModal
      isOpen
      title={`Archive ${profile.title}`}
      confirmButtonLabel="Archive"
      confirmButtonDisabled={isArchivingScriptProfile}
      confirmButtonLoading={isArchivingScriptProfile}
      onConfirm={confirmArchiving}
      close={closeArchivingModal}
      confirmationText={`archive ${profile.title}`}
    >
      <p>
        Archiving the script will prevent it from running in the future.
        <br />
        This action is <strong>irreversible</strong>.
      </p>
    </TextConfirmationModal>
  );
};

export default ScriptProfileArchiveModal;
