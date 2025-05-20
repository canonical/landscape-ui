import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import ListActions from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
import { useRepositoryProfiles } from "../../hooks";
import type { RepositoryProfile } from "../../types";

const RepositoryProfileForm = lazy(
  async () => import("../RepositoryProfileForm"),
);

interface RepositoryProfileListActionsProps {
  readonly profile: RepositoryProfile;
}

const RepositoryProfileListActions: FC<RepositoryProfileListActionsProps> = ({
  profile,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();
  const { removeRepositoryProfileQuery } = useRepositoryProfiles();

  const { mutateAsync: removeRepositoryProfile, isPending: isRemoving } =
    removeRepositoryProfileQuery;

  const handleEditProfile = () => {
    setSidePanelContent(
      `Edit ${profile.title}`,
      <Suspense fallback={<LoadingState />}>
        <RepositoryProfileForm action="edit" profile={profile} />
      </Suspense>,
    );
  };

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const handleRemoveProfile = async () => {
    try {
      await removeRepositoryProfile({
        name: profile.name,
      });

      closeModal();

      notify.success({
        message: `Repository profile "${profile.title}" removed successfully`,
        title: "Repository profile removed",
      });
    } catch (error) {
      debug(error);
    }
  };

  const actions = [
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit "${profile.title}" profile`,
      onClick: handleEditProfile,
    },
  ];

  const destructiveActions = [
    {
      icon: "delete",
      label: "Remove",
      "aria-label": `Remove "${profile.title}" repository profile`,
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
        title="Remove repository profile"
        confirmButtonLabel="Remove"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isRemoving}
        confirmButtonLoading={isRemoving}
        onConfirm={handleRemoveProfile}
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

export default RepositoryProfileListActions;
