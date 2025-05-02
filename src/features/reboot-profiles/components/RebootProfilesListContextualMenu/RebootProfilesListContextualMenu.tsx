import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { MenuLink } from "@canonical/react-components";
import { ContextualMenu, Icon, ICONS } from "@canonical/react-components";
import { lazy, Suspense, useState, type FC } from "react";
import { useRemoveRebootProfileQuery } from "../../api";
import type { RebootProfile } from "../../types";
import classes from "./RebootProfilesListContextualMenu.module.scss";

const RebootProfilesForm = lazy(async () => import("../RebootProfilesForm"));

interface RebootProfilesListContextualMenuProps {
  readonly profile: RebootProfile;
}

const RebootProfilesListContextualMenu: FC<
  RebootProfilesListContextualMenuProps
> = ({ profile }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();

  const { removeRebootProfile, isRemovingRebootProfile } =
    useRemoveRebootProfileQuery();

  const handleRemoveRebootProfile = async () => {
    try {
      await removeRebootProfile({ id: profile.id });

      setModalOpen(false);

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

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const contextualMenuButtons: MenuLink[] = [
    {
      children: (
        <>
          <Icon name="edit" />
          <span>Edit</span>
        </>
      ),
      "aria-label": `Edit "${profile.title}" profile`,
      hasIcon: true,
      onClick: handleRebootProfileEdit,
    },
    {
      children: (
        <>
          <Icon name="canvas" />
          <span>Duplicate</span>
        </>
      ),
      "aria-label": `Duplicate "${profile.title}" profile`,
      hasIcon: true,
      onClick: handleRebootProfileDuplicate,
    },
    {
      children: (
        <>
          <Icon name={ICONS.delete} />
          <span>Remove</span>
        </>
      ),
      "aria-label": `Remove "${profile.title}" upgrade profile`,
      hasIcon: true,
      onClick: handleOpenModal,
    },
  ];

  return (
    <>
      <ContextualMenu
        position="left"
        className={classes.menu}
        toggleClassName={classes.toggleButton}
        toggleAppearance="base"
        toggleLabel={<Icon name="contextual-menu" aria-hidden />}
        toggleProps={{
          "aria-label": `${profile.title} profile actions`,
        }}
        links={contextualMenuButtons}
      />

      <TextConfirmationModal
        isOpen={modalOpen}
        title="Confirm delete"
        confirmButtonLabel="Delete"
        onConfirm={handleRemoveRebootProfile}
        close={handleCloseModal}
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

export default RebootProfilesListContextualMenu;
