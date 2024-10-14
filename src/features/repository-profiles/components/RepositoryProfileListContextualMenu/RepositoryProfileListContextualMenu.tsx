import { FC, lazy, Suspense, useState } from "react";
import { RepositoryProfile } from "../../types";
import {
  ConfirmationModal,
  ContextualMenu,
  Icon,
  ICONS,
  Input,
  MenuLink,
} from "@canonical/react-components";
import classes from "./RepositoryProfileContextualMenu.module.scss";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { useRepositoryProfiles } from "../../hooks";
import useDebug from "@/hooks/useDebug";

const RepositoryProfileForm = lazy(() => import("../RepositoryProfileForm"));

interface RepositoryProfileListContextualMenuProps {
  profile: RepositoryProfile;
}

const RepositoryProfileListContextualMenu: FC<
  RepositoryProfileListContextualMenuProps
> = ({ profile }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDeleteProfileText, setConfirmDeleteProfileText] = useState("");

  const debug = useDebug();
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

  const handleRemoveProfile = async () => {
    try {
      await removeRepositoryProfile({
        name: profile.name,
      });
    } catch (error) {
      debug(error);
    } finally {
      handleCloseModal();
    }
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmDeleteProfileText(e.target.value);
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

      {modalOpen && (
        <ConfirmationModal
          title="Remove repository profile"
          confirmButtonLabel="Remove"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={
            isRemoving || confirmDeleteProfileText !== `remove ${profile.name}`
          }
          confirmButtonLoading={isRemoving}
          onConfirm={handleRemoveProfile}
          close={handleCloseModal}
        >
          <p>
            This will remove &quot;{profile.title}&quot; profile. This action is
            irreversible.
          </p>
          Type <b>remove {profile.name}</b> to confirm.
          <Input
            type="text"
            value={confirmDeleteProfileText}
            onChange={handleChange}
          />
        </ConfirmationModal>
      )}
    </>
  );
};

export default RepositoryProfileListContextualMenu;
