import LoadingState from "@/components/layout/LoadingState";
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
import type { ChangeEvent } from "react";
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
  const [confirmDeleteProfileText, setConfirmDeleteProfileText] = useState("");

  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();

  const { removeRebootProfile, isRemovingRebootProfile } =
    useRemoveRebootProfileQuery();

  const handleRemoveRebootProfile = async () => {
    try {
      await removeRebootProfile({ id: profile.id });
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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmDeleteProfileText(event.target.value);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setConfirmDeleteProfileText("");
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

      {modalOpen && (
        <ConfirmationModal
          title="Confirm delete"
          confirmButtonLabel="Delete"
          onConfirm={handleRemoveRebootProfile}
          close={handleCloseModal}
          confirmButtonDisabled={
            confirmDeleteProfileText !== `remove ${profile.title}` ||
            isRemovingRebootProfile
          }
        >
          <div>
            <p>
              Are you sure you want to remove &quot;{profile.title}
              &quot; reboot profile? The removal of &quot;{profile.title}&quot;
              reboot profile is irreversible and might adversely affect your
              system.
            </p>
            Type <strong>remove {profile.title}</strong> to confirm.
          </div>
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

export default RebootProfilesListContextualMenu;
