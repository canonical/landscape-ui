import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import type { ListAction } from "@/components/layout/ListActions";
import ListActions from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import { useBoolean } from "usehooks-ts";
import { useRemovalProfiles } from "../../hooks";
import type { RemovalProfile } from "../../types";

const SingleRemovalProfileForm = lazy(
  async () => import("../SingleRemovalProfileForm"),
);

interface RemovalProfileListActionsProps {
  readonly profile: RemovalProfile;
}

const RemovalProfileListActions: FC<RemovalProfileListActionsProps> = ({
  profile,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();

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
    setSidePanelContent(
      `Edit ${profile.title} profile`,
      <Suspense fallback={<LoadingState />}>
        <SingleRemovalProfileForm action="edit" profile={removalProfile} />
      </Suspense>,
    );
  };

  const actions: ListAction[] = [
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit "${profile.title}" profile`,
      onClick: () => {
        handleRemovalProfileEdit(profile);
      },
    },
  ];

  const destructiveActions: ListAction[] = [
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
        confirmationText={`remove ${profile.name}`}
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
