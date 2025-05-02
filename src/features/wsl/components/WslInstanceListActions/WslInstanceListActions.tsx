import { useWsl } from "@/features/wsl";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import type { MenuLink } from "@canonical/react-components";
import {
  ConfirmationModal,
  ContextualMenu,
  Icon,
} from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";
import classes from "./WslInstanceListActions.module.scss";
import type { Action } from "./types";
import type { WslInstanceWithoutRelation } from "@/types/Instance";
import useNotify from "@/hooks/useNotify";
import TextConfirmationModal from "@/components/form/TextConfirmationModal";

interface WslInstanceListActionsProps {
  readonly instance: WslInstanceWithoutRelation;
  readonly parentId: number;
}

const WslInstanceListActions: FC<WslInstanceListActionsProps> = ({
  instance,
  parentId,
}) => {
  const [action, setAction] = useState<Action>(null);

  const { notify } = useNotify();
  const debug = useDebug();
  const { setDefaultChildInstanceQuery, deleteChildInstancesQuery } = useWsl();
  const { removeInstancesQuery } = useInstances();

  const {
    mutateAsync: setDefaultChildInstance,
    isPending: isSettingDefaultChildInstance,
  } = setDefaultChildInstanceQuery;
  const { mutateAsync: deleteChildInstances, isPending: isDeleting } =
    deleteChildInstancesQuery;
  const { mutateAsync: removeInstances, isPending: isRemoving } =
    removeInstancesQuery;

  const handleCloseModal = () => {
    setAction(null);
  };

  const handleSetDefaultChildInstance = async () => {
    try {
      await setDefaultChildInstance({
        child_id: instance.id,
        parent_id: parentId,
      });

      handleCloseModal();

      notify.success({
        title: `You queued ${instance.title} to be set as the default instance`,
        message: `${instance.title} will be the default instance.`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleDeleteChildInstance = async () => {
    try {
      await deleteChildInstances({
        computer_ids: [instance.id],
      });

      handleCloseModal();

      notify.success({
        title: `You queued ${instance.title} to be deleted.`,
        message: `${instance.title} will be deleted.`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleRemoveInstanceFromLandscape = async () => {
    try {
      await removeInstances({
        computer_ids: [instance.id],
      });

      handleCloseModal();

      notify.success({
        title: `You have successfully removed ${instance.title}`,
        message: `${instance.title} has been removed from Landscape. To manage it again, you will need to re-register it in Landscape.`,
      });
    } catch (error) {
      debug(error);
    }
  };

  const contextualMenuLinks: MenuLink[] = [
    {
      children: "Set default instance",
      "aria-label": `Set ${instance.title} as default instance`,
      onClick: () => {
        setAction("setDefault");
      },
    },
    {
      children: "Remove instance from Landscape",
      "aria-label": `Remove ${instance.title} instance from Landscape`,
      onClick: () => {
        setAction("remove");
      },
    },
    {
      children: "Delete instance",
      "aria-label": `Delete ${instance.title} instance`,
      onClick: () => {
        setAction("delete");
      },
    },
  ].filter((link) => {
    if (link.children === "Set default instance") {
      return !instance.is_default_child;
    }
    return true;
  });

  return (
    <>
      <ContextualMenu
        position="left"
        className={classes.menu}
        toggleClassName={classes.toggleButton}
        toggleAppearance="base"
        toggleLabel={<Icon name="contextual-menu" />}
        toggleProps={{ "aria-label": `${instance.title} instance actions` }}
        links={contextualMenuLinks}
      />
      {action === "setDefault" && (
        <ConfirmationModal
          title="Set default instance"
          confirmButtonLabel="Set default"
          confirmButtonAppearance="positive"
          confirmButtonDisabled={isSettingDefaultChildInstance}
          confirmButtonLoading={isSettingDefaultChildInstance}
          onConfirm={handleSetDefaultChildInstance}
          close={handleCloseModal}
        >
          <p>
            Are you sure you want to set {instance.title} as default instance?
          </p>
        </ConfirmationModal>
      )}
      <TextConfirmationModal
        isOpen={action === "delete"}
        close={handleCloseModal}
        title="Delete instance"
        confirmButtonLabel="Delete"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isDeleting}
        confirmButtonLoading={isDeleting}
        confirmationText={`delete ${instance.title}`}
        onConfirm={handleDeleteChildInstance}
      >
        <p>
          This will permanently delete the instance <b>{instance.title}</b> from
          both the Windows host machine and Landscape.
        </p>
      </TextConfirmationModal>
      <TextConfirmationModal
        isOpen={action === "remove"}
        close={handleCloseModal}
        title="Remove instance from Landscape"
        confirmButtonLabel="Remove"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isRemoving}
        confirmButtonLoading={isRemoving}
        confirmationText={`remove ${instance.title}`}
        onConfirm={handleRemoveInstanceFromLandscape}
      >
        <p>
          This will remove the instance <b>{instance.title}</b> from Landscape.
          It will remain on the parent machine. You can re-register it to
          Landscape at any time.
        </p>
      </TextConfirmationModal>
    </>
  );
};

export default WslInstanceListActions;
