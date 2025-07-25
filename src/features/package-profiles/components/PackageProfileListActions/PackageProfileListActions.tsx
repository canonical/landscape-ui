import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import ListActions from "@/components/layout/ListActions";
import useDebug from "@/hooks/useDebug";
import useNavigateWithSearch from "@/hooks/useNavigateWithSearch";
import useNotify from "@/hooks/useNotify";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { usePackageProfiles } from "../../hooks";
import type { PackageProfile } from "../../types";

interface PackageProfileListActionsProps {
  readonly profile: PackageProfile;
}

const PackageProfileListActions: FC<PackageProfileListActionsProps> = ({
  profile,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const navigateWithSearch = useNavigateWithSearch();

  const { removePackageProfileQuery } = usePackageProfiles();

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const { mutateAsync: removePackageProfile, isPending: isRemoving } =
    removePackageProfileQuery;

  const encodedName = encodeURIComponent(profile.name);

  const handleConstraintsChange = () => {
    navigateWithSearch(`change-package-constraints/${encodedName}`);
  };

  const handlePackageProfileEdit = () => {
    navigateWithSearch(`edit/${encodedName}`);
  };

  const handlePackageProfileDuplicate = () => {
    navigateWithSearch(`duplicate/${encodedName}`);
  };

  const handleRemovePackageProfile = async () => {
    try {
      await removePackageProfile({ name: profile.name });

      notify.success({
        message: `Package profile "${profile.title}" removed successfully`,
        title: "Package profile removed",
      });
    } catch (error) {
      debug(error);
    } finally {
      closeModal();
    }
  };

  const actions: Action[] = [
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit ${profile.title} profile`,
      onClick: handlePackageProfileEdit,
    },
    {
      icon: "applications",
      label: "Change package constraints",
      "aria-label": `Change ${profile.title} package constraints`,
      onClick: handleConstraintsChange,
    },
    {
      icon: "canvas",
      label: "Duplicate",
      "aria-label": `Duplicate ${profile.title} profile`,
      onClick: handlePackageProfileDuplicate,
    },
  ];

  const destructiveActions: Action[] = [
    {
      icon: "delete",
      label: "Remove",
      "aria-label": `Remove ${profile.title} profile`,
      onClick: openModal,
    },
  ];

  return (
    <>
      <ListActions
        toggleAriaLabel={`${profile.title} profile actions`}
        actions={actions}
        destructiveActions={destructiveActions}
      />

      <TextConfirmationModal
        isOpen={isModalOpen}
        title="Remove package profile"
        confirmButtonLabel="Remove"
        confirmButtonAppearance="negative"
        confirmButtonLoading={isRemoving}
        confirmButtonDisabled={isRemoving}
        close={closeModal}
        confirmationText={`remove ${profile.title}`}
        onConfirm={handleRemovePackageProfile}
      >
        <p>
          This will remove &quot;{profile.title}&quot; profile. This action is{" "}
          <b>irreversible</b>.
        </p>
      </TextConfirmationModal>
    </>
  );
};

export default PackageProfileListActions;
