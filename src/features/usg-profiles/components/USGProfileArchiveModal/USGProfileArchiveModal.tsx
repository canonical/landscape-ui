import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { FC } from "react";
import { useArchiveUsgProfile } from "../../api";
import type { USGProfile } from "../../types";

interface USGProfileArchiveModalProps {
  readonly profile: USGProfile;
  readonly opened: boolean;
  readonly close: () => void;
}

const USGProfileArchiveModal: FC<USGProfileArchiveModalProps> = ({
  close,
  opened,
  profile,
}) => {
  const { notify } = useNotify();
  const debug = useDebug();

  const { archiveUsgProfile, isArchivingUsgProfile } = useArchiveUsgProfile();

  const onConfirm = async () => {
    try {
      await archiveUsgProfile({
        id: profile.id,
      });

      notify.success({
        title: `You have archived "${profile.title}" profile`,
        message:
          "It will no longer run, but past audit data and profile details will remain accessible for selected duration of the retention period.",
      });
    } catch (error) {
      debug(error);
    } finally {
      close();
    }
  };

  return (
    <TextConfirmationModal
      isOpen={opened}
      title={`Archive "${profile.title}" profile`}
      close={close}
      confirmButtonLabel="Archive"
      confirmationText={`archive ${profile.title}`}
      confirmButtonLoading={isArchivingUsgProfile}
      confirmButtonDisabled={isArchivingUsgProfile}
      onConfirm={onConfirm}
    >
      <p>
        You are about to archive the {profile.title} profile. Archiving this USG
        profile will prevent it from running. However, it will{" "}
        <strong>NOT</strong> delete past audit data or remove the profile
        details. You will not be able to reactivate the profile after it has
        been archived.
      </p>
    </TextConfirmationModal>
  );
};

export default USGProfileArchiveModal;
