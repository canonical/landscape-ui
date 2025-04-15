import { useWsl } from "@/features/wsl";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import type { MenuLink } from "@canonical/react-components";
import {
  ConfirmationModal,
  ContextualMenu,
  Icon,
  Input,
} from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";
import classes from "./WslInstanceListActions.module.scss";
import { getModalBody } from "./helpers";
import type { Action } from "./types";
import type { WslInstanceWithoutRelation } from "@/types/Instance";

interface WslInstanceListActionsProps {
  readonly instance: WslInstanceWithoutRelation;
  readonly parentId: number;
}

const WslInstanceListActions: FC<WslInstanceListActionsProps> = ({
  instance,
  parentId,
}) => {
  const [action, setAction] = useState<Action>(null);
  const [confirmationText, setConfirmationText] = useState<string>("");

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

  const { body, appearance, title, label } = getModalBody(instance, action);
  const isPerformingAction =
    isSettingDefaultChildInstance || isRemoving || isDeleting;

  const isWrongConfirmationText =
    action === "remove" && confirmationText !== `remove ${instance.title}`;

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
      {action && (
        <ConfirmationModal
          title={title}
          confirmButtonLabel={label}
          confirmButtonAppearance={appearance}
          confirmButtonDisabled={isPerformingAction || isWrongConfirmationText}
          confirmButtonLoading={isPerformingAction}
          onConfirm={handleModalAction}
          close={handleCloseModal}
        >
          {body}
          {action === "remove" && (
            <>
              <p>
                Type <b>{`remove ${instance.title}`}</b> to confirm.
              </p>
              <Input
                type="text"
                value={confirmationText}
                onChange={(e) => {
                  setConfirmationText(e.target.value);
                }}
              />
            </>
          )}
        </ConfirmationModal>
      )}
    </>
  );
};

export default WslInstanceListActions;
