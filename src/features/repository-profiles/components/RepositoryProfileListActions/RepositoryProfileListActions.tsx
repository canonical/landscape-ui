import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import ListActions from "@/components/layout/ListActions";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useRepositoryProfiles } from "../../api";
import type { RepositoryProfile } from "../../types";

interface RepositoryProfileListActionsProps {
  readonly profile: RepositoryProfile;
}

const RepositoryProfileListActions: FC<RepositoryProfileListActionsProps> = ({
  profile,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { createPageParamsSetter } = usePageParams();

  const { removeRepositoryProfileQuery } = useRepositoryProfiles();

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const { mutateAsync: removeRepositoryProfile, isPending: isRemoving } =
    removeRepositoryProfileQuery;

  const handleEditProfile = createPageParamsSetter({
    sidePath: ["edit"],
    name: profile.name,
  });

  const handleViewProfile = createPageParamsSetter({
    sidePath: ["view"],
    name: profile.name,
  });

  const handleRemoveProfile = async () => {
    try {
      await removeRepositoryProfile({
        name: profile.name,
      });

      notify.success({
        message: `Repository profile "${profile.title}" removed successfully`,
        title: "Repository profile removed",
      });
    } catch (error) {
      debug(error);
    } finally {
      closeModal();
    }
  };

  const actions: Action[] = [
    {
      icon: "show",
      label: "View details",
      "aria-label": `View "${profile.title}" profile`,
      onClick: handleViewProfile,
    },
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit "${profile.title}" profile`,
      onClick: handleEditProfile,
    },
  ];

  const destructiveActions: Action[] = [
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
        confirmationText={`remove ${profile.title}`}
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
