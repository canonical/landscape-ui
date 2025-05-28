import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import type { ListAction } from "@/components/layout/ListActions";
import ListActions from "@/components/layout/ListActions";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { lazy, Suspense, type FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useRemoveRebootProfileQuery } from "../../api";
import type { RebootProfile } from "../../types";

const RebootProfilesForm = lazy(async () => import("../RebootProfilesForm"));

interface RebootProfilesListActionsProps {
  readonly profile: RebootProfile;
}

const RebootProfilesListActions: FC<RebootProfilesListActionsProps> = ({
  profile,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();

  const { setSidePanelContent } = useSidePanel();

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

      openModal();

      notify.success({
        message: `Reboot profile "${profile.title}" removed successfully`,
        title: "Reboot profile removed",
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleRebootProfileEdit = () => {
    setSidePanelContent(
      `Edit "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <RebootProfilesForm action="edit" profile={profile} />
      </Suspense>,
    );
  };

  const handleRebootProfileDuplicate = () => {
    setSidePanelContent(
      `Duplicate "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <RebootProfilesForm action="duplicate" profile={profile} />
      </Suspense>,
    );
  };

  const actions: ListAction[] = [
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
