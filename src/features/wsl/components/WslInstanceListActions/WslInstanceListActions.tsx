import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import ListActions, { type ListAction } from "@/components/layout/ListActions";
import { useWsl } from "@/features/wsl";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useNotify from "@/hooks/useNotify";
import type { WslInstanceWithoutRelation } from "@/types/Instance";
import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import { useState } from "react";
import type { Action } from "./types";

interface WslInstanceListActionsProps {
  readonly instance: WslInstanceWithoutRelation;
  readonly parentId: number;
}

const WslInstanceListActions: FC<WslInstanceListActionsProps> = ({
  instance,
  parentId,
}) => {
  const { notify } = useNotify();
  const debug = useDebug();

  const { setDefaultChildInstanceQuery, deleteChildInstancesQuery } = useWsl();
  const { removeInstancesQuery } = useInstances();

  const [action, setAction] = useState<Action>(null);

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

  const actions: ListAction[] | undefined = !instance.is_default_child
    ? [
        {
          icon: "starred",
          label: "Set default instance",
          "aria-label": `Set ${instance.title} as default instance`,
          onClick: () => {
            setAction("setDefault");
          },
        },
      ]
    : undefined;

  const destructiveActions: ListAction[] = [
    {
      icon: "delete",
      label: "Remove instance from Landscape",
      "aria-label": `Remove ${instance.title} instance from Landscape`,
      onClick: () => {
        setAction("remove");
      },
    },
    {
      icon: "delete",
      label: "Delete instance",
      "aria-label": `Delete ${instance.title} instance`,
      onClick: () => {
        setAction("delete");
      },
    },
  ];

  return (
    <>
      <ListActions
        toggleAriaLabel={`${instance.title} instance actions`}
        actions={actions}
        destructiveActions={destructiveActions}
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
