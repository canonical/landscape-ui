import ListActions from "@/components/layout/ListActions";
import { WindowsInstanceMakeCompliantModal } from "@/features/wsl";
import type { WindowsInstanceWithoutRelation } from "@/types/Instance";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";

interface WindowsInstanceActionsProps {
  readonly instance: WindowsInstanceWithoutRelation;
}

const WindowsInstanceActions: FC<WindowsInstanceActionsProps> = ({
  instance,
}) => {
  const {
    value: isMakeCompliantModalOpen,
    setTrue: openMakeCompliantModal,
    setFalse: closeMakeCompliantModal,
  } = useBoolean();

  return (
    <>
      <ListActions
        destructiveActions={[
          {
            icon: "security-tick",
            label: "Make compliant",
            onClick: openMakeCompliantModal,
          },
        ]}
        toggleAriaLabel={`${instance.title} actions`}
      />

      <WindowsInstanceMakeCompliantModal
        close={closeMakeCompliantModal}
        instances={[instance]}
        isOpen={isMakeCompliantModalOpen}
      />
    </>
  );
};

export default WindowsInstanceActions;
