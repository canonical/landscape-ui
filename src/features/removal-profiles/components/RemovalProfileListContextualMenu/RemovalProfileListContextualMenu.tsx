import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { MenuLink } from "@canonical/react-components";
import {
  ConfirmationModal,
  ContextualMenu,
  Icon,
  ICONS,
  Input,
} from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import type { RemovalProfile } from "../../types";
import classes from "./RemovalProfileListContextualMenu.module.scss";
import LoadingState from "@/components/layout/LoadingState";
import { useRemovalProfiles } from "../../hooks";

const SingleRemovalProfileForm = lazy(
  () => import("../SingleRemovalProfileForm"),
);

interface RemovalProfileListContextualMenuProps {
  readonly profile: RemovalProfile;
}

const RemovalProfileListContextualMenu: FC<
  RemovalProfileListContextualMenuProps
> = ({ profile }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDeleteProfileText, setConfirmDeleteProfileText] = useState("");

  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();
  const { removeRemovalProfileQuery } = useRemovalProfiles();

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
      handleCloseModal();
    }
  };

  const handleRemovalProfileEdit = (profile: RemovalProfile) => {
    setSidePanelContent(
      `Edit ${profile.title} profile`,
      <Suspense fallback={<LoadingState />}>
        <SingleRemovalProfileForm action="edit" profile={profile} />
      </Suspense>,
    );
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
      onClick: () => handleRemovalProfileEdit(profile),
    },
    {
      children: (
        <>
          <Icon name={ICONS.delete} />
          <span>Remove</span>
        </>
      ),
      "aria-label": `Remove "${profile.title}" profile`,
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
          title="Remove package profile"
          confirmButtonLabel="Remove"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={
            confirmDeleteProfileText !== profile.name || isRemoving
          }
          confirmButtonLoading={isRemoving}
          onConfirm={handleRemovalProfileRemove}
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

export default RemovalProfileListContextualMenu;
