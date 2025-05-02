import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { MenuLink } from "@canonical/react-components";
import { ContextualMenu, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import { useWslProfiles } from "../../hooks";
import type { WslProfile } from "../../types";
import classes from "./WslProfilesListContextualMenu.module.scss";

const WslProfileEditForm = lazy(async () => import("../WslProfileEditForm"));
const WslProfileInstallForm = lazy(
  async () => import("../WslProfileInstallForm"),
);

interface WslProfilesListContextualMenuProps {
  readonly profile: WslProfile;
}

const WslProfilesListContextualMenu: FC<WslProfilesListContextualMenuProps> = ({
  profile,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();
  const { removeWslProfileQuery } = useWslProfiles();

  const { mutateAsync: removeWslProfile, isPending: isRemoving } =
    removeWslProfileQuery;

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

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleRemoveWslProfile = async () => {
    try {
      await removeWslProfile({ name: profile.name });

      handleCloseModal();

      notify.success({
        message: `WSL profile "${profile.title}" removed successfully.`,
        title: "WSL profile removed",
      });
    } catch (error) {
      debug(error);
    }
  };

  const contextualMenuLinks: MenuLink[] = [
    {
      children: (
        <>
          <Icon name="edit" />
          <span>Edit</span>
        </>
      ),
      "aria-label": `Edit ${profile.title} profile`,
      hasIcon: true,
      onClick: handleWslProfileEdit,
    },
    {
      children: (
        <>
          <Icon name="canvas" />
          <span>Duplicate</span>
        </>
      ),
      "aria-label": `Duplicate ${profile.title} profile`,
      hasIcon: true,
      onClick: handleWslProfileDuplicate,
    },
    {
      children: (
        <>
          <Icon name={ICONS.delete} />
          <span>Remove</span>
        </>
      ),
      "aria-label": `Remove ${profile.title} profile`,
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
        toggleProps={{ "aria-label": `${profile.title} profile actions` }}
        links={contextualMenuLinks}
      />

      <TextConfirmationModal
        isOpen={modalOpen}
        title="Remove WSL profile"
        confirmButtonLabel="Remove"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isRemoving}
        confirmButtonLoading={isRemoving}
        onConfirm={handleRemoveWslProfile}
        close={handleCloseModal}
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

export default WslProfilesListContextualMenu;
