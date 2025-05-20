import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import ListActions from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
import { useWslProfiles } from "../../hooks";
import type { WslProfile } from "../../types";

const WslProfileEditForm = lazy(async () => import("../WslProfileEditForm"));
const WslProfileInstallForm = lazy(
  async () => import("../WslProfileInstallForm"),
);

interface WslProfilesListActionsProps {
  readonly profile: WslProfile;
}

const WslProfilesListActions: FC<WslProfilesListActionsProps> = ({
  profile,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();
  const { removeWslProfileQuery } = useWslProfiles();

  const { mutateAsync: removeWslProfile, isPending: isRemoving } =
    removeWslProfileQuery;

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const handleWslProfileEdit = () => {
    setSidePanelContent(
      `Edit "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <WslProfileEditForm profile={profile} />
      </Suspense>,
    );
  };

  const handleWslProfileDuplicate = () => {
    setSidePanelContent(
      `Duplicate "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <WslProfileInstallForm action="duplicate" profile={profile} />
      </Suspense>,
    );
  };

  const handleRemoveWslProfile = async () => {
    try {
      await removeWslProfile({ name: profile.name });

      closeModal();

      notify.success({
        message: `WSL profile "${profile.title}" removed successfully.`,
        title: "WSL profile removed",
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
      onClick: handleWslProfileEdit,
    },
    {
      icon: "canvas",
      label: "Duplicate",
      "aria-label": `Duplicate ${profile.title} profile`,
      onClick: handleWslProfileDuplicate,
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
        title="Remove WSL profile"
        confirmButtonLabel="Remove"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isRemoving}
        confirmButtonLoading={isRemoving}
        onConfirm={handleRemoveWslProfile}
        close={closeModal}
        confirmationText={`remove ${profile.name}`}
      >
        <p>
          Removing this profile will affect{" "}
          <b>{profile.computers.constrained.length} instances</b>. This action
          is <b>irreversible</b>.
        </p>
      </TextConfirmationModal>
    </>
  );
};

export default WslProfilesListActions;
