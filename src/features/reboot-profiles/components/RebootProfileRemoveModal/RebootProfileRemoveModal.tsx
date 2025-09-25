import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useRemoveRebootProfileQuery } from "../../api";
import type { RebootProfile } from "../../types";

export interface RebootProfileRemoveModalProps {
  readonly close: () => void;
  readonly opened: boolean;
  readonly rebootProfile: RebootProfile;
}

const RebootProfileRemoveModal: FC<RebootProfileRemoveModalProps> = ({
  close,
  opened,
  rebootProfile,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { setPageParams } = usePageParams();

  const { removeRebootProfile, isRemovingRebootProfile } =
    useRemoveRebootProfileQuery();

  const handleRemoveRebootProfile = async () => {
    try {
      await removeRebootProfile({
        id: rebootProfile.id,
      });

      setPageParams({ sidePath: [], profile: "" });

      notify.success({
        title: "Reboot profile removed",
        message: `Reboot profile ${rebootProfile.title} has been removed`,
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
      title="Remove reboot profile"
      confirmButtonLabel="Remove"
      confirmButtonAppearance="negative"
      onConfirm={handleRemoveRebootProfile}
      confirmButtonDisabled={isRemovingRebootProfile}
      confirmButtonLoading={isRemovingRebootProfile}
      close={close}
      confirmationText={`remove ${rebootProfile.title}`}
    >
      <p>
        Are you sure you want to remove &quot;{rebootProfile.title}
        &quot; reboot profile? The removal of &quot;{rebootProfile.title}
        &quot; reboot profile is irreversible and might adversely affect your
        system.
      </p>
    </TextConfirmationModal>
  );
};

export default RebootProfileRemoveModal;
