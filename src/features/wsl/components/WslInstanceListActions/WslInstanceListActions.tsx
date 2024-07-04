import { FC } from "react";
import { Button, ContextualMenu, Icon } from "@canonical/react-components";
import { useWsl } from "@/features/wsl";
import useConfirm from "@/hooks/useConfirm";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import { InstanceWithoutRelation } from "@/types/Instance";
import classes from "./WslInstanceListActions.module.scss";

interface WslInstanceListActionsProps {
  instance: InstanceWithoutRelation;
  parentId: number;
}

const WslInstanceListActions: FC<WslInstanceListActionsProps> = ({
  instance,
  parentId,
}) => {
  const debug = useDebug();
  const { confirmModal, closeConfirmModal } = useConfirm();
  const { setDefaultChildInstanceQuery, deleteChildInstancesQuery } = useWsl();
  const { removeInstancesQuery } = useInstances();

  const { mutateAsync: setDefaultChildInstance } = setDefaultChildInstanceQuery;
  const { mutateAsync: deleteChildInstances } = deleteChildInstancesQuery;
  const { mutateAsync: removeInstances } = removeInstancesQuery;

  const handleSetDefaultChildInstance = async () => {
    try {
      await setDefaultChildInstance({
        child_id: instance.id,
        parent_id: parentId,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleSetDefaultChildInstanceDialog = () => {
    confirmModal({
      title: "Set default instance",
      body: `Are you sure you want to set ${instance.title} as default instance?`,
      buttons: [
        <Button
          key="set-default"
          appearance="positive"
          onClick={handleSetDefaultChildInstance}
        >
          Set default
        </Button>,
      ],
    });
  };

  const handleDeleteChildInstance = async () => {
    try {
      await deleteChildInstances({
        computer_ids: [instance.id],
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleDeleteChildInstanceDialog = () => {
    confirmModal({
      title: "Delete instance",
      body: (
        <p>
          This will permanently delete the instance <b>{instance.title}</b> from
          both the Windows host machine and Landscape.
        </p>
      ),
      buttons: [
        <Button
          key="delete"
          appearance="negative"
          onClick={handleDeleteChildInstance}
        >
          Delete
        </Button>,
      ],
    });
  };

  const handleRemoveInstanceFromLandscape = async () => {
    try {
      await removeInstances({
        computer_ids: [instance.id],
      });
    } catch (error) {
      debug(error);
    } finally {
      closeConfirmModal();
    }
  };

  const handleRemoveInstanceFromLandscapeDialog = () => {
    confirmModal({
      title: "Remove instance from Landscape",
      body: (
        <p>
          This will remove the instance <b>{instance.title}</b> from Landscape.
          <br />
          <br />
          It will remain on the parent machine. You can re-register it to
          Landscape at any time.
        </p>
      ),
      buttons: [
        <Button
          key="remove"
          appearance="negative"
          onClick={handleRemoveInstanceFromLandscape}
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
      toggleProps={{ "aria-label": `${instance.title} instance actions` }}
    >
      <Button
        type="button"
        appearance="base"
        className={classes.actionButton}
        onClick={handleSetDefaultChildInstanceDialog}
        aria-label={`Set ${instance.title} as default instance`}
      >
        Set default instance
      </Button>
      <Button
        type="button"
        appearance="base"
        className={classes.actionButton}
        onClick={handleRemoveInstanceFromLandscapeDialog}
        aria-label={`Remove ${instance.title} instance from Landscape`}
      >
        Remove from Landscape
      </Button>
      <Button
        type="button"
        appearance="base"
        className={classes.actionButton}
        onClick={handleDeleteChildInstanceDialog}
        aria-label={`Delete ${instance.title} instance`}
      >
        Delete instance
      </Button>
    </ContextualMenu>
  );
};

export default WslInstanceListActions;
