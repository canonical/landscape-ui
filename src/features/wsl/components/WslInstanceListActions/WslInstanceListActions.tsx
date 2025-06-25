import ListActions from "@/components/layout/ListActions";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { Action } from "@/types/Action";
import type {
  WindowsInstanceWithoutRelation,
  WslInstanceWithoutRelation,
} from "@/types/Instance";
import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import WslInstanceRemoveFromLandscapeModal from "../../../instances/components/InstanceRemoveFromLandscapeModal";
import { useSetWslInstanceAsDefault } from "../../api/useSetWslInstanceAsDefault";
import WslInstanceReinstallModal from "../WslInstanceReinstallModal";
import WslInstanceUninstallModal from "../WslInstanceUninstallModal";

interface WslInstanceListActionsProps {
  readonly windowsInstance: WindowsInstanceWithoutRelation;
  readonly wslInstance: WslInstanceWithoutRelation;
}

const WslInstanceListActions: FC<WslInstanceListActionsProps> = ({
  windowsInstance,
  wslInstance,
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
        child_id: wslInstance.id,
        parent_id: windowsInstance.id,
      });

      notify.success({
        title: `You have successfully marked ${wslInstance.title} to be set as the default instance`,
        message: `An activity has been queued to set it as the default instance.`,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeSetAsDefaultModal();
    }
  };

  const actions: Action[] | undefined = !wslInstance.is_default_child
    ? [
        {
          icon: "show",
          label: "View details",
        },
        {
          icon: "starred",
          label: "Set as default",
          "aria-label": `Set ${wslInstance.title} as default`,
          onClick: openSetAsDefaultModal,
        },
      ]
    : undefined;

  const destructiveActions: Action[] = [
    {
      icon: "restart",
      label: "Reinstall",
      "aria-label": `Reinstall ${wslInstance.title}`,

      onClick: openReinstallModal,
    },
    {
      icon: "close",
      label: "Uninstall",
      "aria-label": `Uninstall ${wslInstance.title}`,
      onClick: openUninstallModal,
    },
    {
      icon: "delete",
      label: "Remove from Landscape",
      "aria-label": `Remove ${wslInstance.title} from Landscape`,
      onClick: openRemoveFromLandscapeModal,
    },
  ];

  return (
    <>
      <ListActions
        toggleAriaLabel={`${wslInstance.title} instance actions`}
        actions={actions}
        destructiveActions={destructiveActions}
      />

      {isSetAsDefaultModalOpen && (
        <ConfirmationModal
          title={`Set ${wslInstance.title} as default`}
          confirmButtonLabel="Set as default"
          confirmButtonAppearance="positive"
          confirmButtonDisabled={isSettingWslInstanceAsDefault}
          confirmButtonLoading={isSettingWslInstanceAsDefault}
          onConfirm={setAsDefault}
          close={closeSetAsDefaultModal}
        >
          <p>
            Are you sure you want to set {wslInstance.title} as default
            instance?
          </p>
        </ConfirmationModal>
      )}

      <WslInstanceReinstallModal
        close={closeReinstallModal}
        instances={[wslInstance]}
        isOpen={isReinstallModalOpen}
      />

      <WslInstanceUninstallModal
        close={closeUninstallModal}
        instances={[wslInstance]}
        isOpen={isUninstallModalOpen}
        parentId={windowsInstance.id}
      />

      <WslInstanceRemoveFromLandscapeModal
        close={closeRemoveFromLandscapeModal}
        instances={[wslInstance]}
        isOpen={isRemoveFromLandscapeModalOpen}
      />
    </>
  );
};

export default WslInstanceListActions;
