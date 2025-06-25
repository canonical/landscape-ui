import ListActions from "@/components/layout/ListActions";
import {
  WslInstanceReinstallModal,
  WslInstanceUninstallModal,
} from "@/features/wsl";
import type { WslInstanceWithoutRelation } from "@/types/Instance";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";

interface WslInstanceActionsProps {
  readonly instance: WslInstanceWithoutRelation;
  readonly parentId: number;
}

const WslInstanceActions: FC<WslInstanceActionsProps> = ({
  instance,
  parentId,
}) => {
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

  return (
    <>
      <ListActions
        actions={[
          {
            icon: "begin-downloading",
            label: "Install",
            onClick: () => {
              throw new Error("This feature is not implemented yet.");
            },
          },
        ]}
        destructiveActions={[
          { icon: "restart", label: "Reinstall", onClick: openReinstallModal },
          { icon: "close", label: "Uninstall", onClick: openUninstallModal },
        ]}
        toggleAriaLabel={`${instance.title} actions`}
      />

      <WslInstanceReinstallModal
        close={closeReinstallModal}
        instances={[instance]}
        isOpen={isReinstallModalOpen}
      />

      <WslInstanceUninstallModal
        close={closeUninstallModal}
        instances={[instance]}
        isOpen={isUninstallModalOpen}
        parentId={parentId}
      />
    </>
  );
};

export default WslInstanceActions;
