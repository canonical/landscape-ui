import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import ListActions from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
import { usePackageProfiles } from "../../hooks";
import type { PackageProfile } from "../../types";

const PackageProfileConstraintsEditForm = lazy(
  async () => import("../PackageProfileConstraintsEditForm"),
);
const PackageProfileDuplicateForm = lazy(
  async () => import("../PackageProfileDuplicateForm"),
);
const PackageProfileEditForm = lazy(
  async () => import("../PackageProfileEditForm"),
);

interface PackageProfileListActionsProps {
  readonly profile: PackageProfile;
}

const PackageProfileListActions: FC<PackageProfileListActionsProps> = ({
  profile,
}) => {
  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();
  const { removePackageProfileQuery } = usePackageProfiles();

  const { mutateAsync: removePackageProfile, isPending: isRemoving } =
    removePackageProfileQuery;

  const handleConstraintsChange = () => {
    setSidePanelContent(
      `Change "${profile.title}" profile's constraints`,
      <Suspense fallback={<LoadingState />}>
        <PackageProfileConstraintsEditForm profile={profile} />
      </Suspense>,
      "medium",
    );
  };

  const handlePackageProfileEdit = () => {
    setSidePanelContent(
      `Edit "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <PackageProfileEditForm profile={profile} />
      </Suspense>,
    );
  };

  const handlePackageProfileDuplicate = () => {
    setSidePanelContent(
      `Duplicate "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <PackageProfileDuplicateForm profile={profile} />
      </Suspense>,
    );
  };

  const handleRemovePackageProfile = async () => {
    try {
      await removePackageProfile({ name: profile.name });

      closeModal();

      notify.success({
        message: `Package profile "${profile.title}" removed successfully`,
        title: "Package profile removed",
      });
    } catch (error) {
      debug(error);
    }
  };

  const actions = [
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

  const destructiveActions = [
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
        confirmationText={`remove ${profile.name}`}
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
