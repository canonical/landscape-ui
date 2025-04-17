import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import type { MenuLink } from "@canonical/react-components";
import {
  ConfirmationModal,
  ContextualMenu,
  Icon,
  ICONS,
  Input,
} from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import { usePackageProfiles } from "../../hooks";
import type { PackageProfile } from "../../types";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import classes from "./PackageProfileListContextualMenu.module.scss";

const PackageProfileConstraintsEditForm = lazy(
  async () => import("../PackageProfileConstraintsEditForm"),
);
const PackageProfileDuplicateForm = lazy(
  async () => import("../PackageProfileDuplicateForm"),
);
const PackageProfileEditForm = lazy(
  async () => import("../PackageProfileEditForm"),
);

interface PackageProfileListContextualMenuProps {
  readonly profile: PackageProfile;
}

const PackageProfileListContextualMenu: FC<
  PackageProfileListContextualMenuProps
> = ({ profile }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDeleteProfileText, setConfirmDeleteProfileText] = useState("");

  const debug = useDebug();
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();
  const { removePackageProfileQuery } = usePackageProfiles();

  const { mutateAsync: removePackageProfile, isPending: isRemoving } =
    removePackageProfileQuery;

  const handleConstraintsChange = () => {
    setSidePanelContent(
      `Change "${profile.title}" profile's constraints`,
      <Suspense fallback={<LoadingState />}>
        <PackageProfileConstraintsEditForm profile={profile} />
      </Suspense>,
      "medium",
    );
  };

  const handlePackageProfileEdit = () => {
    setSidePanelContent(
      `Edit "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <PackageProfileEditForm profile={profile} />
      </Suspense>,
    );
  };

  const handlePackageProfileDuplicate = () => {
    setSidePanelContent(
      `Duplicate "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <PackageProfileDuplicateForm profile={profile} />
      </Suspense>,
    );
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setConfirmDeleteProfileText("");
  };

  const handleRemovePackageProfile = async () => {
    try {
      await removePackageProfile({ name: profile.name });

      notify.success({
        message: `Package profile "${profile.title}" removed successfully`,
        title: "Package profile removed",
      });
    } catch (error) {
      debug(error);
    } finally {
      handleCloseModal();
    }
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
      "aria-label": `Edit ${profile.title} profile`,
      hasIcon: true,
      onClick: handlePackageProfileEdit,
    },
    {
      children: (
        <>
          <Icon name="applications" />
          <span className={classes.noWrap}>Change package constraints</span>
        </>
      ),
      "aria-label": `Change ${profile.title} package constraints`,
      hasIcon: true,
      onClick: handleConstraintsChange,
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
      onClick: handlePackageProfileDuplicate,
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
            isRemoving || confirmDeleteProfileText !== `remove ${profile.name}`
          }
          confirmButtonLoading={isRemoving}
          onConfirm={handleRemovePackageProfile}
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

export default PackageProfileListContextualMenu;
