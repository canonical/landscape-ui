import { FC, useState } from "react";
import {
  ConfirmationModal,
  ContextualMenu,
  Icon,
  MenuLink,
} from "@canonical/react-components";
import { useWsl } from "@/features/wsl";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import { InstanceWithoutRelation } from "@/types/Instance";
import classes from "./WslInstanceListActions.module.scss";
import { getModalBody } from "./constants";
import { Action } from "./types";

interface WslInstanceListActionsProps {
  instance: InstanceWithoutRelation;
  parentId: number;
}

const WslInstanceListActions: FC<WslInstanceListActionsProps> = ({
  instance,
  parentId,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState<Action>(null);

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

  const handleSetDefaultChildInstance = async () => {
    try {
      await setDefaultChildInstance({
        child_id: instance.id,
        parent_id: parentId,
      });
    } catch (error) {
      debug(error);
    } finally {
      handleCloseModal();
    }
  };

  const handleDeleteChildInstance = async () => {
    try {
      await deleteChildInstances({
        computer_ids: [instance.id],
      });
    } catch (error) {
      debug(error);
    } finally {
      handleCloseModal();
    }
  };

  const handleRemoveInstanceFromLandscape = async () => {
    try {
      await removeInstances({
        computer_ids: [instance.id],
      });
    } catch (error) {
      debug(error);
    } finally {
      handleCloseModal();
    }
  };

  const handleModalAction = () => {
    if (action === "setDefault") {
      handleSetDefaultChildInstance();
    } else if (action === "remove") {
      handleRemoveInstanceFromLandscape();
    } else if (action === "delete") {
      handleDeleteChildInstance();
    }
  };

  const handleOpenModal = (action: Action) => {
    setModalOpen(true);
    setAction(action);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setAction(null);
  };

  const contextualMenuLinks: MenuLink[] = [
    {
      children: "Set default instance",
      "aria-label": `Set ${instance.title} as default instance`,
      onClick: () => handleOpenModal("setDefault"),
    },
    {
      children: "Remove instance from Landscape",
      "aria-label": `Remove ${instance.title} instance from Landscape`,
      onClick: () => handleOpenModal("remove"),
    },
    {
      children: "Delete instance",
      "aria-label": `Delete ${instance.title} instance`,
      onClick: () => handleOpenModal("delete"),
    },
  ].filter((link) => {
    if (link.children === "Set default instance") {
      return !instance.is_default_child;
    }
    return true;
  });

  const { body, appearance, title, label } = getModalBody(instance, action);
  const isPerformingAction =
    isSettingDefaultChildInstance || isRemoving || isDeleting;

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
      {modalOpen && action && (
        <ConfirmationModal
          title={title}
          confirmButtonLabel={label}
          confirmButtonAppearance={appearance}
          confirmButtonDisabled={isPerformingAction}
          confirmButtonLoading={isPerformingAction}
          onConfirm={handleModalAction}
          close={handleCloseModal}
        >
          {body}
        </ConfirmationModal>
      )}
    </>
  );
};

export default WslInstanceListActions;
