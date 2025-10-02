import type { TextConfirmationModalProps } from "@/components/form/TextConfirmationModal";
import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useUpgradeProfiles } from "../../hooks";
import type { UpgradeProfile } from "../../types";

interface UpgradeProfileRemoveModalProps
  extends Pick<TextConfirmationModalProps, "close" | "isOpen"> {
  readonly upgradeProfile: UpgradeProfile;
}

const UpgradeProfileRemoveModal: FC<UpgradeProfileRemoveModalProps> = ({
  close,
  isOpen,
  upgradeProfile,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { setPageParams } = usePageParams();

  const { removeUpgradeProfileQuery } = useUpgradeProfiles();
  const { mutateAsync: removeUpgradeProfile, isPending: isRemoving } =
    removeUpgradeProfileQuery;

  const handleRemoveUpgradeProfile = async () => {
    try {
      await removeUpgradeProfile({ name: upgradeProfile.name });

      setPageParams({ sidePath: [], profile: "" });

      notify.success({
        title: "Upgrade profile removed",
        message: `Upgrade profile ${upgradeProfile.title} has been removed`,
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
      title="Remove upgrade profile"
      confirmButtonLabel="Remove"
      confirmButtonAppearance="negative"
      confirmButtonLoading={isRemoving}
      onConfirm={handleRemoveUpgradeProfile}
      close={close}
      confirmationText={`remove ${upgradeProfile.title}`}
    >
      <p>
        This will remove &quot;{upgradeProfile.title}&quot; upgrade profile.
        This action is <b>irreversible</b>.
      </p>
    </TextConfirmationModal>
  );
};

export default UpgradeProfileRemoveModal;
