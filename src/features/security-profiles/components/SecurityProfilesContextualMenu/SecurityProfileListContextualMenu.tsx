import type { MenuLink } from "@canonical/react-components";
import {
  ConfirmationModal,
  ContextualMenu,
  Icon,
} from "@canonical/react-components";
import { useState, type FC } from "react";
import type { SecurityProfile } from "../../types";
import type { SecurityProfileActions } from "../../types/SecurityProfileActions";
import classes from "./SecurityProfileListContextualMenu.module.scss";
import useNotify from "@/hooks/useNotify";
import { useArchiveSecurityProfile } from "../../api";

interface SecurityProfileListContextualMenuProps {
  readonly actions: SecurityProfileActions;
  readonly profile: SecurityProfile;
}

const SecurityProfileListContextualMenu: FC<
  SecurityProfileListContextualMenuProps
> = ({ actions, profile }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { notify } = useNotify();
  const { archiveSecurityProfile, isArchivingSecurityProfile } =
    useArchiveSecurityProfile();

  const handleArchiveButtonClick = () => {
    setIsOpen(true);
  };

  const handleModalClose = () => {
    setIsOpen(false);
  };

  const handleArchiveProfile = async () => {
    await archiveSecurityProfile({
      id: profile.id,
    });

    handleModalClose();
    notify.success({
      title: `You have archived "${profile.name}" profile`,
      message:
        "It will no longer run, but past audit data and profile details will remain accessible for selected duration of the retention period. You can activate it anytime.",
    });
  };

  const contextualMenuButtons: MenuLink[] = [
    {
      children: (
        <>
          <Icon name="switcher-environments" />
          <span>View details</span>
        </>
      ),
      "aria-label": `View "${profile.title}" security profile details`,
      hasIcon: true,
      onClick: actions.viewDetails,
    },
    {
      children: (
        <>
          <Icon name="begin-downloading" />
          <span>Download audit</span>
        </>
      ),
      "aria-label": `Download "${profile.title}" security profile audit`,
      hasIcon: true,
      onClick: actions.downloadAudit,
    },
    {
      children: (
        <>
          <Icon name="edit" />
          <span>Edit</span>
        </>
      ),
      "aria-label": `Edit "${profile.title}" security profile`,
      hasIcon: true,
      onClick: actions.edit,
    },
    {
      children: (
        <>
          <Icon name="play" />
          <span>Run</span>
        </>
      ),
      "aria-label": `Run "${profile.title}" security profile`,
      hasIcon: true,
    },
    {
      children: (
        <>
          <Icon name="canvas" />
          <span>Duplicate profile</span>
        </>
      ),
      "aria-label": `Duplicate "${profile.title}" security profile`,
      hasIcon: true,
      onClick: actions.duplicate,
    },
    {
      children: (
        <>
          <Icon name="archive-red" />
          <span className={classes.colorNegative}>Archive</span>
        </>
      ),
      "aria-label": `Archive "${profile.title}" security profile`,
      hasIcon: true,
      onClick: handleArchiveButtonClick,
    },
  ];

  return (
    <>
      <ContextualMenu
        position="right"
        className={classes.menu}
        toggleClassName={classes.toggleButton}
        toggleAppearance="base"
        toggleLabel={<Icon name="contextual-menu" />}
        toggleProps={{ "aria-label": `${profile.title} profile actions` }}
        links={contextualMenuButtons}
      />
      {isOpen && (
        <ConfirmationModal
          title={`Archive "${profile.name}" profile`}
          confirmButtonLabel="Archive"
          onConfirm={handleArchiveProfile}
          confirmButtonAppearance="negative"
          confirmButtonDisabled={isArchivingSecurityProfile}
          confirmButtonLoading={isArchivingSecurityProfile}
          close={handleModalClose}
        >
          <p>
            You are about to archive the &quot;{profile.name}&quot; profile.
            Archiving this Security profile will prevent it from running.
            However, it will NOT delete past audit data or remove the profile
            details. You can reactivate the profile later to allow it to run
            again.
          </p>
        </ConfirmationModal>
      )}
    </>
  );
};

export default SecurityProfileListContextualMenu;
