import type { TextConfirmationModalProps } from "@/components/form/TextConfirmationModal";
import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { usePackageProfiles } from "../../hooks";
import type { PackageProfile } from "../../types";

interface PackageProfileRemoveModalProps extends Pick<
  TextConfirmationModalProps,
  "close" | "isOpen"
> {
  readonly packageProfile: PackageProfile;
}

const PackageProfileRemoveModal: FC<PackageProfileRemoveModalProps> = ({
  close,
  isOpen,
  packageProfile,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { setPageParams } = usePageParams();

  const { removePackageProfileQuery } = usePackageProfiles();
  const { mutateAsync: removePackageProfile, isPending: isRemoving } =
    removePackageProfileQuery;

  const handleRemovePackageProfile = async () => {
    try {
      await removePackageProfile({ name: packageProfile.name });

      setPageParams({ sidePath: [], profile: "" });

      notify.success({
        message: `Package profile "${packageProfile.name}" removed successfully.`,
        title: "Package profile removed",
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
      title="Remove package profile"
      confirmButtonLabel="Remove"
      confirmButtonAppearance="negative"
      confirmButtonLoading={isRemoving}
      confirmationText={`remove ${packageProfile.title}`}
      onConfirm={handleRemovePackageProfile}
      close={close}
    >
      <p>
        This will remove &quot;{packageProfile.title}&quot; profile. This action
        is <b>irreversible</b>.
      </p>
    </TextConfirmationModal>
  );
};

export default PackageProfileRemoveModal;
