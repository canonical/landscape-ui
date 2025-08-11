import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import useNotify from "@/hooks/useNotify";
import type { FC } from "react";
import { useArchiveScriptProfile } from "../../api";
import type { ScriptProfile } from "../../types";

interface ScriptProfileArchiveModalProps {
  readonly profile: ScriptProfile;
  readonly opened: boolean;
  readonly onClose: () => void;
}

const ScriptProfileArchiveModal: FC<ScriptProfileArchiveModalProps> = ({
  profile,
  opened,
  onClose,
}) => {
  const { notify } = useNotify();

  const { archiveScriptProfile, isArchivingScriptProfile } =
    useArchiveScriptProfile();

  const confirmArchiving = async () => {
    await archiveScriptProfile({ ...profile });

    onClose();

    notify.success({
      title: `You have successfully archived "${profile.title}"`,
      message: "The profile will no longer run on the defined schedule.",
    });
  };

  return (
    <TextConfirmationModal
      isOpen={opened}
      title={`Archive ${profile.title}`}
      confirmButtonLabel="Archive"
      confirmButtonDisabled={isArchivingScriptProfile}
      confirmButtonLoading={isArchivingScriptProfile}
      onConfirm={confirmArchiving}
      close={onClose}
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
