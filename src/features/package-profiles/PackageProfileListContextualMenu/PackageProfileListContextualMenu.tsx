import classNames from "classnames";
import { FC, lazy, Suspense } from "react";
import { Button, ContextualMenu, Icon } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import { usePackageProfiles } from "@/features/package-profiles/hooks";
import { PackageProfile } from "@/features/package-profiles/types";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import classes from "./PackageProfileListContextualMenu.module.scss";

const PackageProfileConstraintsEditForm = lazy(
  () => import("@/features/package-profiles/PackageProfileConstraintsEditForm"),
);
const PackageProfileDuplicateForm = lazy(
  () => import("@/features/package-profiles/PackageProfileDuplicateForm"),
);
const PackageProfileEditForm = lazy(
  () => import("@/features/package-profiles/PackageProfileEditForm"),
);

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
      `Change "${profile.name}" profile's constraints`,
      <Suspense fallback={<LoadingState />}>
        <PackageProfileConstraintsEditForm profile={profile} />
      </Suspense>,
      "medium",
    );
  };

  const handlePackageProfileEdit = (profile: PackageProfile) => {
    setSidePanelContent(
      "Edit package profile",
      <Suspense fallback={<LoadingState />}>
        <PackageProfileEditForm profile={profile} />
      </Suspense>,
    );
  };

  const handlePackageProfileDuplicate = (profile: PackageProfile) => {
    setSidePanelContent(
      "Duplicate package profile",
      <Suspense fallback={<LoadingState />}>
        <PackageProfileDuplicateForm profile={profile} />
      </Suspense>,
    );
  };

  const handleRemovePackageProfile = async (name: string) => {
    try {
      await removePackageProfile({ name });

      notify.success({
        message: `Package profile "${name}" removed successfully`,
        title: "Package profile removed",
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRemovePackageProfileDialog = (name: string) => {
    confirmModal({
      title: "Remove package profile",
      body: `This will remove "${name}" profile.`,
      buttons: [
        <Button
          key="remove"
          type="button"
          appearance="negative"
          onClick={() => handleRemovePackageProfile(name)}
          aria-label={`Remove ${name} profile`}
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
        aria-label={`Edit ${profile.name} profile`}
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
        aria-label={`Change ${profile.name} package constraints`}
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
        aria-label={`Duplicate ${profile.name} profile`}
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
        onClick={() => handleRemovePackageProfileDialog(profile.name)}
        aria-label={`Remove ${profile.name} profile`}
      >
        <Icon name="delete" />
        <span>Remove</span>
      </Button>
    </ContextualMenu>
  );
};

export default PackageProfileListContextualMenu;
