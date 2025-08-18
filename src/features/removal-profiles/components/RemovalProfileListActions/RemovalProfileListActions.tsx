import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import ListActions from "@/components/layout/ListActions";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import type { Action } from "@/types/Action";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useRemovalProfiles } from "../../hooks";
import type { RemovalProfile } from "../../types";

interface RemovalProfileListActionsProps {
  readonly profile: RemovalProfile;
}

const RemovalProfileListActions: FC<RemovalProfileListActionsProps> = ({
  profile,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { setPageParams } = usePageParams();

  const { removeRemovalProfileQuery } = useRemovalProfiles();

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const { mutateAsync: removeRemovalProfile, isPending: isRemoving } =
    removeRemovalProfileQuery;

  const handleRemovalProfileRemove = async () => {
    try {
      await removeRemovalProfile({ name: profile.name });

      notify.success({
        message: `${profile.title} profile removed successfully`,
        title: "Removal profile removed",
      });
    } catch (error) {
      debug(error);
    } finally {
      closeModal();
    }
  };

  const handleRemovalProfileEdit = (removalProfile: RemovalProfile) => {
    setPageParams({ sidePath: ["edit"], removalProfile: removalProfile.id });
  };

  const actions: Action[] = [
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit "${profile.title}" profile`,
      onClick: () => {
        handleRemovalProfileEdit(profile);
      },
    },
  ];

  const destructiveActions: Action[] = [
    {
      icon: "delete",
      label: "Remove",
      "aria-label": `Remove "${profile.title}" profile`,
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
        confirmationText={`remove ${profile.title}`}
        confirmButtonLabel="Remove"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isRemoving}
        confirmButtonLoading={isRemoving}
        onConfirm={handleRemovalProfileRemove}
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

export default RemovalProfileListActions;
