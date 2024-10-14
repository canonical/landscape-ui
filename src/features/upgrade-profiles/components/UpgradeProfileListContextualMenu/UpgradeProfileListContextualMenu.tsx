import { FC, lazy, Suspense, useState } from "react";
import { UpgradeProfile } from "../../types";
import {
  ConfirmationModal,
  ContextualMenu,
  Icon,
  ICONS,
  Input,
  MenuLink,
} from "@canonical/react-components";
import classes from "./UpgradeProfileListContextualMenu.module.scss";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { useUpgradeProfiles } from "../../hooks";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";

const SingleUpgradeProfileForm = lazy(
  () => import("../SingleUpgradeProfileForm"),
);

interface UpgradeProfileListContextualMenuProps {
  profile: UpgradeProfile;
}

const UpgradeProfileListContextualMenu: FC<
  UpgradeProfileListContextualMenuProps
> = ({ profile }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDeleteProfileText, setConfirmDeleteProfileText] = useState("");

  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();
  const { removeUpgradeProfileQuery } = useUpgradeProfiles();

  const { mutateAsync: removeUpgradeProfile, isPending: isRemoving } =
    removeUpgradeProfileQuery;

  const handleRemoveUpgradeProfile = async () => {
    try {
      await removeUpgradeProfile({ name: profile.name });

      notify.success({
        message: `Upgrade profile "${profile.title}" removed successfully`,
        title: "Upgrade profile removed",
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleUpgradeProfileEdit = () => {
    setSidePanelContent(
      `Edit "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <SingleUpgradeProfileForm action="edit" profile={profile} />
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
      onClick: handleUpgradeProfileEdit,
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
        toggleProps={{ "aria-label": `${profile.name} profile actions` }}
        links={contextualMenuButtons}
      />

      {modalOpen && (
        <ConfirmationModal
          title="Remove upgrade profile"
          confirmButtonLabel="Remove"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={
            isRemoving || confirmDeleteProfileText !== `remove ${profile.name}`
          }
          confirmButtonLoading={isRemoving}
          onConfirm={handleRemoveUpgradeProfile}
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

export default UpgradeProfileListContextualMenu;
