import useNotify from "@/hooks/useNotify";
import { ConfirmationModal, Input } from "@canonical/react-components";
import { useState, type FC } from "react";
import { useArchiveScriptProfile } from "../../api";
import type { ScriptProfile } from "../../types";

interface ScriptProfileArchiveModalProps {
  readonly profile: ScriptProfile | null;
  readonly removeProfile: () => void;
}

const ScriptProfileArchiveModal: FC<ScriptProfileArchiveModalProps> = ({
  profile,
  removeProfile,
}) => {
  const { notify } = useNotify();

  const { archiveScriptProfile, isArchivingScriptProfile } =
    useArchiveScriptProfile();

  const [confirmationText, setConfirmationText] = useState("");

  if (!profile) {
    return;
  }

  const closeArchivingModal = () => {
    removeProfile();
    setConfirmationText("");
  };

  const confirmArchiving = async () => {
    if (!profile) {
      return;
    }

    await archiveScriptProfile({ ...profile });

    closeArchivingModal();

    notify.success({
      title: `You have successfully archived ${profile.title}`,
      message: "The profile will no longer run on the defined schedule.",
    });
  };

  return (
    <ConfirmationModal
      title={`Archive ${profile.title}`}
      confirmButtonLabel="Archive"
      confirmButtonDisabled={
        confirmationText != `archive ${profile.title}` ||
        isArchivingScriptProfile
      }
      confirmButtonLoading={isArchivingScriptProfile}
      onConfirm={confirmArchiving}
      close={closeArchivingModal}
    >
      <p>
        Archiving the script will prevent it from running in the future.
        <br />
        This action is <strong>irreversible</strong>.
      </p>

      <p>
        Type <strong>archive {profile.title}</strong> to confirm.
      </p>

      <Input
        type="text"
        value={confirmationText}
        onChange={(event) => {
          setConfirmationText(event.target.value);
        }}
      />
    </ConfirmationModal>
  );
};

export default ScriptProfileArchiveModal;
