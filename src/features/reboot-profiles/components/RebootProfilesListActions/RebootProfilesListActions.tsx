import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import ListActions from "@/components/layout/ListActions";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import type { Action } from "@/types/Action";
import { type FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useRemoveRebootProfileQuery } from "../../api";
import type { RebootProfile } from "../../types";

interface RebootProfilesListActionsProps {
  readonly profile: RebootProfile;
}

const RebootProfilesListActions: FC<RebootProfilesListActionsProps> = ({
  profile,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();

  const { setPageParams } = usePageParams();

  const {
    value: isModalOpen,
    setTrue: openModal,
    setFalse: closeModal,
  } = useBoolean();

  const { removeRebootProfile, isRemovingRebootProfile } =
    useRemoveRebootProfileQuery();

  const handleRemoveRebootProfile = async () => {
    try {
      await removeRebootProfile({ id: profile.id });

      notify.success({
        message: `Reboot profile "${profile.title}" removed successfully`,
        title: "Reboot profile removed",
      });
    } catch (error) {
      debug(error);
    } finally {
      closeModal();
    }
  };

  const handleRebootProfileEdit = () => {
    setPageParams({ sidePath: ["edit"], rebootProfile: profile.id });
  };

  const handleRebootProfileDuplicate = () => {
    setPageParams({ sidePath: ["duplicate"], rebootProfile: profile.id });
  };

  const actions: Action[] = [
    {
      icon: "edit",
      label: "Edit",
      "aria-label": `Edit "${profile.title}" profile`,
      onClick: handleRebootProfileEdit,
    },
    {
      icon: "canvas",
      label: "Duplicate",
      "aria-label": `Duplicate "${profile.title}" profile`,
      onClick: handleRebootProfileDuplicate,
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
        title="Confirm delete"
        confirmButtonLabel="Delete"
        onConfirm={handleRemoveRebootProfile}
        close={closeModal}
        confirmButtonDisabled={isRemovingRebootProfile}
        confirmButtonLoading={isRemovingRebootProfile}
        confirmButtonAppearance="negative"
        confirmationText={`remove ${profile.title}`}
      >
        <p>
          Are you sure you want to remove &quot;{profile.title}
          &quot; reboot profile? The removal of &quot;{profile.title}&quot;
          reboot profile is irreversible and might adversely affect your system.
        </p>
      </TextConfirmationModal>
    </>
  );
};

export default RebootProfilesListActions;
