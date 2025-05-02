import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import type { MenuLink } from "@canonical/react-components";
import { ContextualMenu, Icon, ICONS } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import type { RemovalProfile } from "../../types";
import classes from "./RemovalProfileListContextualMenu.module.scss";
import LoadingState from "@/components/layout/LoadingState";
import { useRemovalProfiles } from "../../hooks";
import TextConfirmationModal from "@/components/form/TextConfirmationModal";

const SingleRemovalProfileForm = lazy(
  async () => import("../SingleRemovalProfileForm"),
);

interface RemovalProfileListContextualMenuProps {
  readonly profile: RemovalProfile;
}

const RemovalProfileListContextualMenu: FC<
  RemovalProfileListContextualMenuProps
> = ({ profile }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();
  const { removeRemovalProfileQuery } = useRemovalProfiles();

  const { mutateAsync: removeRemovalProfile, isPending: isRemoving } =
    removeRemovalProfileQuery;

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleRemovalProfileRemove = async () => {
    try {
      await removeRemovalProfile({ name: profile.name });

      handleCloseModal();

      notify.success({
        message: `${profile.title} profile removed successfully`,
        title: "Removal profile removed",
      });
    } catch (error) {
      debug(error);
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
      onClick: () => {
        handleRemovalProfileEdit(profile);
      },
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

      <TextConfirmationModal
        isOpen={modalOpen}
        title="Remove package profile"
        confirmationText={`remove ${profile.name}`}
        confirmButtonLabel="Remove"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isRemoving}
        confirmButtonLoading={isRemoving}
        onConfirm={handleRemovalProfileRemove}
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

export default RemovalProfileListContextualMenu;
