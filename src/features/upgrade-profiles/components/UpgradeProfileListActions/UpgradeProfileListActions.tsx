import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import ListActions, { type ListAction } from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
import { useUpgradeProfiles } from "../../hooks";
import type { UpgradeProfile } from "../../types";

const SingleUpgradeProfileForm = lazy(
  async () => import("../SingleUpgradeProfileForm"),
);

interface UpgradeProfileListActionsProps {
  readonly profile: UpgradeProfile;
}

const UpgradeProfileListActions: FC<UpgradeProfileListActionsProps> = ({
  profile,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();

  const { removeUpgradeProfileQuery } = useUpgradeProfiles();

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const { mutateAsync: removeUpgradeProfile, isPending: isRemoving } =
    removeUpgradeProfileQuery;

  const handleRemoveUpgradeProfile = async () => {
    try {
      await removeUpgradeProfile({ name: profile.name });

      notify.success({
        message: `Upgrade profile "${profile.title}" removed successfully`,
        title: "Upgrade profile removed",
      });
    } catch (error) {
      debug(error);
    } finally {
      closeModal();
    }
  };

  const handleUpgradeProfileEdit = () => {
    setSidePanelContent(
      `Edit "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <SingleUpgradeProfileForm action="edit" profile={profile} />
      </Suspense>,
    );
  };

  const actions: ListAction[] = [
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit "${profile.title}" profile`,
      onClick: handleUpgradeProfileEdit,
    },
  ];

  const destructiveActions: ListAction[] = [
    {
      icon: "delete",
      label: "Remove",
      "aria-label": `Remove "${profile.title}" upgrade profile`,
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
        confirmationText={`remove ${profile.name}`}
        title="Remove upgrade profile"
        confirmButtonLabel="Remove"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isRemoving}
        confirmButtonLoading={isRemoving}
        onConfirm={handleRemoveUpgradeProfile}
        close={closeModal}
      >
        <p>
          This will remove &quot;{profile.title}&quot; profile. This action is{" "}
          <b>irreversible</b>.
        </p>
      </TextConfirmationModal>
    </>
  );
};

export default UpgradeProfileListActions;
