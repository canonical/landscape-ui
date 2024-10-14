import { FC, lazy, Suspense, useState } from "react";
import { WslProfile } from "../../types";
import {
  ConfirmationModal,
  ContextualMenu,
  Icon,
  ICONS,
  Input,
  MenuLink,
} from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { useWslProfiles } from "../../hooks";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import classes from "./WslProfilesListContextualMenu.module.scss";

const WslProfileEditForm = lazy(() => import("../WslProfileEditForm"));
const WslProfileInstallForm = lazy(() => import("../WslProfileInstallForm"));

interface WslProfilesListContextualMenuProps {
  profile: WslProfile;
}

const WslProfilesListContextualMenu: FC<WslProfilesListContextualMenuProps> = ({
  profile,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDeleteProfileText, setConfirmDeleteProfileText] = useState("");

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

  const handleRemoveWslProfile = async () => {
    try {
      await removeWslProfile({ name: profile.name });

      notify.success({
        message: `WSL profile "${profile.title}" removed successfully.`,
        title: "WSL profile removed",
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
    setConfirmDeleteProfileText("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmDeleteProfileText(e.target.value);
  };

  const contextualMenuLinks: MenuLink[] = [
    {
      children: (
        <>
          <Icon name="edit" />
          <span>Edit</span>
        </>
      ),
      "aria-label": `Edit ${profile.name} profile`,
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
      "aria-label": `Duplicate ${profile.name} profile`,
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
      "aria-label": `Remove ${profile.name} profile`,
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
        links={contextualMenuLinks}
      />
      {modalOpen && (
        <ConfirmationModal
          title="Remove WSL profile"
          confirmButtonLabel="Remove"
          confirmButtonAppearance="negative"
          confirmButtonDisabled={
            isRemoving || confirmDeleteProfileText !== `remove ${profile.name}`
          }
          confirmButtonLoading={isRemoving}
          onConfirm={handleRemoveWslProfile}
          close={handleCloseModal}
        >
          <p>
            Removing this profile will affect{" "}
            <b>{profile.computers.constrained.length} instances</b>. This action
            is irreversible.
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

export default WslProfilesListContextualMenu;
