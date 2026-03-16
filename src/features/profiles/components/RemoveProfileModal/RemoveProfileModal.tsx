import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import type { FC } from "react";
import type { Profile } from "../../types";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { capitalize } from "@/utils/_helpers";
import { getModalMessage, getNotificationMessage } from "./helpers";
import { canArchiveProfile, type ProfileTypes } from "../../helpers";
import { useRemoveProfile } from "../../api/useRemoveProfile";

interface RemoveProfileModalProps {
  readonly profile: Profile;
  readonly type: ProfileTypes;
  readonly opened: boolean;
  readonly closeModal: () => void;
}

const RemoveProfileModal: FC<RemoveProfileModalProps> = ({
  profile,
  type,
  opened,
  closeModal,
}) => {
  const removalType = canArchiveProfile(type) ? "archive" : "remove";
  const removalTypeTitle = capitalize(removalType);

  const notificationMessage =
    `You have successfully ${removalType}d "${profile.title}" profile.` +
    getNotificationMessage(type);

  const { notify } = useNotify();
  const debug = useDebug();

  const { removeProfile, isRemovingProfile } = useRemoveProfile(type);

  const handleRemoveProfile = async () => {
    try {
      await removeProfile({
        id: profile.id,
        name: profile.name ?? profile.title,
      });

      notify.success({
        title: `${capitalize(type)} profile ${removalType}d`,
        message: notificationMessage,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeModal();
    }
  };

  return (
    <TextConfirmationModal
      isOpen={opened}
      title={`${removalTypeTitle} ${type} profile`}
      confirmButtonLabel={removalTypeTitle}
      confirmButtonAppearance="negative"
      onConfirm={handleRemoveProfile}
      confirmButtonDisabled={isRemovingProfile}
      confirmButtonLoading={isRemovingProfile}
      close={closeModal}
      confirmationText={`${removalType} ${profile.title}`}
    >
      <p>{getModalMessage(type, profile.title)}</p>
      <p>
        This action is <strong>irreversible</strong>.
      </p>
    </TextConfirmationModal>
  );
};

export default RemoveProfileModal;
