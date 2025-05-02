import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import type { MenuLink } from "@canonical/react-components";
import { ContextualMenu, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import { useRepositoryProfiles } from "../../hooks";
import type { RepositoryProfile } from "../../types";
import classes from "./RepositoryProfileContextualMenu.module.scss";
import useNotify from "@/hooks/useNotify";

const RepositoryProfileForm = lazy(
  async () => import("../RepositoryProfileForm"),
);

interface RepositoryProfileListContextualMenuProps {
  readonly profile: RepositoryProfile;
}

const RepositoryProfileListContextualMenu: FC<
  RepositoryProfileListContextualMenuProps
> = ({ profile }) => {
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleRemoveProfile = async () => {
    try {
      await removeRepositoryProfile({
        name: profile.name,
      });

      handleCloseModal();

      notify.success({
        message: `Repository profile "${profile.title}" removed successfully`,
        title: "Repository profile removed",
      });
    } catch (error) {
      debug(error);
    }
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
      onClick: handleEditProfile,
    },
    {
      children: (
        <>
          <Icon name={ICONS.delete} />
          <span>Remove</span>
        </>
      ),
      "aria-label": `Remove "${profile.title}" repository profile`,
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
        toggleLabel={<Icon name="contextual-menu" />}
        toggleProps={{ "aria-label": `${profile.title} profile actions` }}
        links={contextualMenuButtons}
      />
      <TextConfirmationModal
        isOpen={modalOpen}
        confirmationText={`remove ${profile.name}`}
        title="Remove repository profile"
        confirmButtonLabel="Remove"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isRemoving}
        confirmButtonLoading={isRemoving}
        onConfirm={handleRemoveProfile}
        close={handleCloseModal}
      >
        <p>
          This will remove &quot;{profile.title}&quot; profile. This action is{" "}
          <b>irreversible</b>.
        </p>
      </TextConfirmationModal>
    </>
  );
};

export default RepositoryProfileListContextualMenu;
