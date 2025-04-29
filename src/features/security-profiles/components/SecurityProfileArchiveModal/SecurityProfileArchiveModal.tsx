import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import useNotify from "@/hooks/useNotify";
import type { ComponentProps, FC } from "react";
import { useArchiveSecurityProfile } from "../../api";
import type { SecurityProfile } from "../../types";

interface SecurityProfileArchiveModalProps
  extends Pick<ComponentProps<typeof TextConfirmationModal>, "close"> {
  readonly profile: SecurityProfile;
}

const SecurityProfileArchiveModal: FC<SecurityProfileArchiveModalProps> = ({
  close,
  profile,
}) => {
  const { notify } = useNotify();

  const { archiveSecurityProfile, isArchivingSecurityProfile } =
    useArchiveSecurityProfile();

  const onConfirm = async () => {
    await archiveSecurityProfile({
      id: profile.id,
    });
  };

  const onSuccess = () => {
    notify.success({
      title: `You have archived "${profile.title}" profile`,
      message:
        "It will no longer run, but past audit data and profile details will remain accessible for selected duration of the retention period.",
    });
  };

  return (
    <TextConfirmationModal
      title={`Archive "${profile.title}" profile`}
      close={close}
      confirmButtonLabel="Archive"
      confirmationText={`archive ${profile.title}`}
      confirming={isArchivingSecurityProfile}
      onConfirm={onConfirm}
      onSuccess={onSuccess}
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
