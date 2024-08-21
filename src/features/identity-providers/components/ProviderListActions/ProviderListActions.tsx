import classNames from "classnames";
import { FC, lazy, Suspense } from "react";
import { Button, ContextualMenu, Icon } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { IdentityProvider } from "../../types";
import classes from "./ProviderListActions.module.scss";
import { useIdentityProviders } from "@/features/identity-providers";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";

const ProviderForm = lazy(() => import("../ProviderForm"));

interface ProviderListActionsProps {
  provider: IdentityProvider;
}

const ProviderListActions: FC<ProviderListActionsProps> = ({ provider }) => {
  const { setSidePanelContent } = useSidePanel();
  const { closeConfirmModal, confirmModal } = useConfirm();
  const debug = useDebug();
  const { deleteProviderQuery } = useIdentityProviders();

  const { mutateAsync: deleteProvider } = deleteProviderQuery;

  const handleIdentityProviderEdit = () => {
    setSidePanelContent(
      `Edit ${provider.name} provider`,
      <Suspense fallback={<LoadingState />}>
        <ProviderForm action="edit" provider={provider} />
      </Suspense>,
    );
  };

  const handleProviderDelete = async () => {
    try {
      await deleteProvider({ providerId: provider.id });

      closeConfirmModal();
    } catch (error) {
      debug(error);
    }
  };

  const handleProviderDeleteDialog = () => {
    confirmModal({
      body: `This will delete the ${provider.name} provider.`,
      buttons: [
        <Button
          key="delete"
          type="button"
          appearance="negative"
          onClick={handleProviderDelete}
        >
          Delete
        </Button>,
      ],
      title: "Delete identity provider",
    });
  };

  return (
    <ContextualMenu
      position="left"
      toggleClassName={classes.toggleButton}
      toggleAppearance="base"
      toggleLabel={<Icon name="contextual-menu" />}
      toggleProps={{ "aria-label": `${provider.name} provider actions` }}
    >
      <Button
        type="button"
        appearance="base"
        hasIcon
        className={classNames(
          "u-no-margin--bottom u-no-margin--right",
          classes.actionButton,
        )}
        onClick={handleIdentityProviderEdit}
        aria-label={`Edit ${provider.name} provider`}
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
        onClick={handleProviderDeleteDialog}
        aria-label={`Delete ${provider.name} provider`}
        disabled={provider.provider === "ubuntu-one"}
      >
        <Icon name="delete" />
        <span>Delete</span>
      </Button>
    </ContextualMenu>
  );
};

export default ProviderListActions;
