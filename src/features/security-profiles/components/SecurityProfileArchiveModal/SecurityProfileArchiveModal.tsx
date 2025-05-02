import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import useNotify from "@/hooks/useNotify";
import type { FC } from "react";
import { useArchiveSecurityProfile } from "../../api";
import type { SecurityProfile } from "../../types";
import useDebug from "@/hooks/useDebug";

interface SecurityProfileArchiveModalProps {
  readonly profile: SecurityProfile;
  readonly close: () => void;
}

const SecurityProfileArchiveModal: FC<SecurityProfileArchiveModalProps> = ({
  close,
  profile,
}) => {
  const { notify } = useNotify();
  const debug = useDebug();

  const { archiveSecurityProfile, isArchivingSecurityProfile } =
    useArchiveSecurityProfile();

  const onConfirm = async () => {
    try {
      await archiveSecurityProfile({
        id: profile.id,
      });

      close();

      notify.success({
        title: `You have archived "${profile.title}" profile`,
        message:
          "It will no longer run, but past audit data and profile details will remain accessible for selected duration of the retention period.",
      });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <TextConfirmationModal
      isOpen
      title={`Archive "${profile.title}" profile`}
      close={close}
      confirmButtonLabel="Archive"
      confirmationText={`archive ${profile.name}`}
      confirmButtonLoading={isArchivingSecurityProfile}
      confirmButtonDisabled={isArchivingSecurityProfile}
      onConfirm={onConfirm}
    >
      <p>
        You are about to archive the {profile.title} profile. Archiving this
        security profile will prevent it from running. However, it will{" "}
        <strong>NOT</strong> delete past audit data or remove the profile
        details. You will not be able to reactivate the profile after it has
        been archived.
      </p>
    </TextConfirmationModal>
  );
};

export default SecurityProfileArchiveModal;
