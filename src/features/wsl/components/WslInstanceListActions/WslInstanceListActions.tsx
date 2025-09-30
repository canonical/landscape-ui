import ListActions from "@/components/layout/ListActions";
import { useReapplyWslProfile } from "@/features/wsl-profiles";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { Action } from "@/types/Action";
import type {
  InstanceChild,
  WindowsInstanceWithoutRelation,
} from "@/types/Instance";
import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import { useNavigate } from "react-router";
import { useBoolean } from "usehooks-ts";
import { useSetWslInstanceAsDefault } from "../../api/useSetWslInstanceAsDefault";
import WslInstanceReinstallModal from "../WslInstanceReinstallModal";
import WslInstanceRemoveFromLandscapeModal from "../WslInstanceRemoveFromLandscapeModal";
import WslInstanceUninstallModal from "../WslInstanceUninstallModal";
import { ROUTES } from "@/libs/routes";

interface WslInstanceListActionsProps {
  readonly windowsInstance: WindowsInstanceWithoutRelation;
  readonly wslInstance: InstanceChild;
}

const WslInstanceListActions: FC<WslInstanceListActionsProps> = ({
  windowsInstance,
  wslInstance,
}) => {
  const navigate = useNavigate();
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
  const { reapplyWslProfile } = useReapplyWslProfile();

  if (wslInstance.compliance === "pending") {
    return;
  }

  const install = async () => {
    try {
      await reapplyWslProfile({
        name: wslInstance.name,
        computer_ids: [windowsInstance.id],
      });

      notify.success({
        title: `You have successfully queued ${wslInstance.name} to be installed.`,
        message: "An activity has been queued to install it.",
      });
    } catch (error) {
      debug(error);
    }
  };

  const setAsDefault = async () => {
    try {
      if (wslInstance.computer_id === null) {
        return;
      }

      await setWslInstanceAsDefault({
        child_id: wslInstance.computer_id,
        parent_id: windowsInstance.id,
      });

      notify.success({
        title: `You have successfully marked ${wslInstance.name} to be set as the default instance`,
        message: `An activity has been queued to set it as the default instance.`,
      });
    } catch (error) {
      debug(error);
    } finally {
      closeSetAsDefaultModal();
    }
  };

  const actions: Action[] | undefined = !wslInstance.default
    ? [
        {
          icon: "show",
          label: "View details",
          onClick: () =>
            navigate(
              ROUTES.instances.details.child(
                windowsInstance.id,
                wslInstance.computer_id || "",
              ),
            ),
          excluded: wslInstance.computer_id === null,
        },
        {
          icon: "starred",
          label: "Set as default",
          "aria-label": `Set ${wslInstance.name} as default`,
          onClick: openSetAsDefaultModal,
          excluded: wslInstance.computer_id === null,
        },
        {
          icon: "begin-downloading",
          label: "Install",
          "aria-label": `Install ${wslInstance.name}`,
          onClick: install,
          excluded: wslInstance.compliance !== "uninstalled",
        },
      ]
    : undefined;

  const destructiveActions: Action[] = [
    {
      icon: "restart",
      label: "Reinstall",
      "aria-label": `Reinstall ${wslInstance.name}`,
      onClick: openReinstallModal,
      excluded: wslInstance.compliance !== "noncompliant",
    },
    {
      icon: "close",
      label: "Uninstall",
      "aria-label": `Uninstall ${wslInstance.name}`,
      onClick: openUninstallModal,
      excluded: !wslInstance.installed,
    },
    {
      icon: "delete",
      label: "Remove from Landscape",
      "aria-label": `Remove ${wslInstance.name} from Landscape`,
      onClick: openRemoveFromLandscapeModal,
      excluded: wslInstance.computer_id === null,
    },
  ];

  return (
    <>
      <ListActions
        toggleAriaLabel={`${wslInstance.name} instance actions`}
        actions={actions}
        destructiveActions={destructiveActions}
      />

      {isSetAsDefaultModalOpen && (
        <ConfirmationModal
          title={`Set ${wslInstance.name} as default`}
          confirmButtonLabel="Set as default"
          confirmButtonAppearance="positive"
          confirmButtonDisabled={isSettingWslInstanceAsDefault}
          confirmButtonLoading={isSettingWslInstanceAsDefault}
          onConfirm={setAsDefault}
          close={closeSetAsDefaultModal}
        >
          <p>
            Are you sure you want to set {wslInstance.name} as default instance?
          </p>
        </ConfirmationModal>
      )}

      <WslInstanceReinstallModal
        close={closeReinstallModal}
        instances={[wslInstance]}
        isOpen={isReinstallModalOpen}
        windowsInstance={windowsInstance}
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
