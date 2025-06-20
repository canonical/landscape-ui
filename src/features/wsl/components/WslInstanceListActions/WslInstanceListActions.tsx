import ListActions, { type ListAction } from "@/components/layout/ListActions";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { WslInstanceWithoutRelation } from "@/types/Instance";
import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useSetWslInstanceAsDefault } from "../../api/useSetWslInstanceAsDefault";
import WslInstanceReinstallModal from "../WslInstanceReinstallModal";
import WslInstanceRemoveFromLandscapeModal from "../WslInstanceRemoveFromLandscapeModal";
import WslInstanceUninstallModal from "../WslInstanceUninstallModal";

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

  const {
    value: isSetAsDefaultModalOpen,
    setTrue: openSetAsDefaultModal,
    setFalse: closeSetAsDefaultModal,
  } = useBoolean();

  const {
    value: isReinstallModalOpen,
    setTrue: openReinstallModal,
    setFalse: closeReinstallModal,
  } = useBoolean();

  const {
    value: isUninstallModalOpen,
    setTrue: openUninstallModal,
    setFalse: closeUninstallModal,
  } = useBoolean();

  const {
    value: isRemoveFromLandscapeModalOpen,
    setTrue: openRemoveFromLandscapeModal,
    setFalse: closeRemoveFromLandscapeModal,
  } = useBoolean();

  const { isSettingWslInstanceAsDefault, setWslInstanceAsDefault } =
    useSetWslInstanceAsDefault();

  const setAsDefault = async () => {
    try {
      await setWslInstanceAsDefault({
        child_id: instance.id,
        parent_id: parentId,
      });

      notify.success({
        title: `You have successfully marked ${instance.title} to be set as the default instance`,
        message: `An activity has been queued to set it as the default instance.`,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeSetAsDefaultModal();
    }
  };

  const actions: ListAction[] | undefined = !instance.is_default_child
    ? [
        {
          icon: "show",
          label: "View details",
        },
        {
          icon: "starred",
          label: "Set as default",
          "aria-label": `Set ${instance.title} as default`,
          onClick: openSetAsDefaultModal,
        },
      ]
    : undefined;

  const destructiveActions: ListAction[] = [
    {
      icon: "restart",
      label: "Reinstall",
      "aria-label": `Reinstall ${instance.title}`,

      onClick: openReinstallModal,
    },
    {
      icon: "close",
      label: "Uninstall",
      "aria-label": `Uninstall ${instance.title}`,
      onClick: openUninstallModal,
    },
    {
      icon: "delete",
      label: "Remove from Landscape",
      "aria-label": `Remove ${instance.title} from Landscape`,
      onClick: openRemoveFromLandscapeModal,
    },
  ];

  return (
    <>
      <ListActions
        toggleAriaLabel={`${instance.title} instance actions`}
        actions={actions}
        destructiveActions={destructiveActions}
      />

      {isSetAsDefaultModalOpen && (
        <ConfirmationModal
          title={`Set ${instance.title} as default`}
          confirmButtonLabel="Set as default"
          confirmButtonAppearance="positive"
          confirmButtonDisabled={isSettingWslInstanceAsDefault}
          confirmButtonLoading={isSettingWslInstanceAsDefault}
          onConfirm={setAsDefault}
          close={closeSetAsDefaultModal}
        >
          <p>
            Are you sure you want to set {instance.title} as default instance?
          </p>
        </ConfirmationModal>
      )}

      <WslInstanceReinstallModal
        close={closeReinstallModal}
        instances={[instance]}
        isOpen={isReinstallModalOpen}
      />

      <WslInstanceUninstallModal
        close={closeUninstallModal}
        instances={[instance]}
        isOpen={isUninstallModalOpen}
      />

      <WslInstanceRemoveFromLandscapeModal
        close={closeRemoveFromLandscapeModal}
        instances={[instance]}
        isOpen={isRemoveFromLandscapeModalOpen}
      />
    </>
  );
};

export default WslInstanceListActions;
