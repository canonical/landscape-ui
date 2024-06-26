import classNames from "classnames";
import { FC, lazy, Suspense } from "react";
import { Button, ContextualMenu, Icon } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import { usePackageProfiles } from "../../hooks";
import { PackageProfile } from "../../types";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import classes from "./PackageProfileListContextualMenu.module.scss";

const PackageProfileConstraintsEditForm = lazy(
  () => import("../PackageProfileConstraintsEditForm"),
);
const PackageProfileDuplicateForm = lazy(
  () => import("../PackageProfileDuplicateForm"),
);
const PackageProfileEditForm = lazy(() => import("../PackageProfileEditForm"));

interface PackageProfileListContextualMenuProps {
  profile: PackageProfile;
}

const PackageProfileListContextualMenu: FC<
  PackageProfileListContextualMenuProps
> = ({ profile }) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeConfirmModal, confirmModal } = useConfirm();
  const { setSidePanelContent } = useSidePanel();
  const { removePackageProfileQuery } = usePackageProfiles();

  const { mutateAsync: removePackageProfile } = removePackageProfileQuery;

  const handleConstraintsChange = (profile: PackageProfile) => () => {
    setSidePanelContent(
      `Change "${profile.title}" profile's constraints`,
      <Suspense fallback={<LoadingState />}>
        <PackageProfileConstraintsEditForm profile={profile} />
      </Suspense>,
      "medium",
    );
  };

  const handlePackageProfileEdit = (profile: PackageProfile) => {
    setSidePanelContent(
      `Edit "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <PackageProfileEditForm profile={profile} />
      </Suspense>,
    );
  };

  const handlePackageProfileDuplicate = (profile: PackageProfile) => {
    setSidePanelContent(
      `Duplicate "${profile.title}" profile`,
      <Suspense fallback={<LoadingState />}>
        <PackageProfileDuplicateForm profile={profile} />
      </Suspense>,
    );
  };

  const handleRemovePackageProfile = async (profile: PackageProfile) => {
    try {
      await removePackageProfile({ name: profile.name });

      notify.success({
        message: `Package profile "${profile.title}" removed successfully`,
        title: "Package profile removed",
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRemovePackageProfileDialog = (profile: PackageProfile) => {
    confirmModal({
      title: "Remove package profile",
      body: `This will remove "${profile.title}" profile.`,
      buttons: [
        <Button
          key="remove"
          type="button"
          appearance="negative"
          onClick={() => handleRemovePackageProfile(profile)}
          aria-label={`Remove ${profile.title} profile`}
        >
          Remove
        </Button>,
      ],
    });
  };

  return (
    <ContextualMenu
      position="left"
      toggleClassName={classes.toggleButton}
      toggleAppearance="base"
      toggleLabel={<Icon name="contextual-menu" />}
      toggleProps={{ "aria-label": `${profile.title} profile actions` }}
    >
      <Button
        type="button"
        appearance="base"
        hasIcon
        className={classNames(
          "u-no-margin--bottom u-no-margin--right",
          classes.actionButton,
        )}
        onClick={() => handlePackageProfileEdit(profile)}
        aria-label={`Edit ${profile.title} profile`}
      >
        <Icon name="edit" />
        <span>Edit</span>
      </Button>
      <Button
        type="button"
        appearance="base"
        hasIcon
        className={classNames(
          "u-no-margin--bottom u-no-margin--right",
          classes.actionButton,
        )}
        onClick={handleConstraintsChange(profile)}
        aria-label={`Change ${profile.title} package constraints`}
      >
        <Icon name="applications" />
        <span className={classes.noWrap}>Change package constraints</span>
      </Button>
      <Button
        type="button"
        appearance="base"
        hasIcon
        className={classNames(
          "u-no-margin--bottom u-no-margin--right",
          classes.actionButton,
        )}
        onClick={() => handlePackageProfileDuplicate(profile)}
        aria-label={`Duplicate ${profile.title} profile`}
      >
        <Icon name="canvas" />
        <span>Duplicate</span>
      </Button>
      <Button
        type="button"
        appearance="base"
        hasIcon
        className={classNames(
          "u-no-margin--bottom u-no-margin--right",
          classes.actionButton,
        )}
        onClick={() => handleRemovePackageProfileDialog(profile)}
        aria-label={`Remove ${profile.title} profile`}
      >
        <Icon name="delete" />
        <span>Remove</span>
      </Button>
    </ContextualMenu>
  );
};

export default PackageProfileListContextualMenu;
