import ListActions from "@/components/layout/ListActions";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import UpdateMirrorModal from "../UpdateMirrorModal";
import RemoveMirrorModal from "../RemoveMirrorModal";

interface MirrorActionsProps {
  readonly mirrorDisplayName: string;
  readonly mirrorName: string;
}

const MirrorActions: FC<MirrorActionsProps> = ({
  mirrorDisplayName,
  mirrorName,
}) => {
  const { createPageParamsSetter } = usePageParams();

  const {
    value: isUpdateModalOpen,
    setTrue: openUpdateModal,
    setFalse: closeUpdateModal,
  } = useBoolean();
  const {
    value: isRemoveModalOpen,
    setTrue: openRemoveModal,
    setFalse: closeRemoveModal,
  } = useBoolean();

  return (
    <>
      <ListActions
        actions={[
          {
            icon: "show",
            label: "View details",
            onClick: createPageParamsSetter({
              sidePath: ["view"],
              name: mirrorName,
            }),
          },
          {
            icon: "edit",
            label: "Edit",
            onClick: createPageParamsSetter({
              sidePath: ["edit"],
              name: mirrorName,
            }),
          },
          {
            icon: "restart",
            label: "Update",
            onClick: openUpdateModal,
          },
          {
            icon: "upload",
            label: "Publish",
            onClick: createPageParamsSetter({
              sidePath: ["publish"],
              name: mirrorName,
            }),
          },
        ]}
        destructiveActions={[
          {
            icon: "delete",
            label: "Remove",
            onClick: openRemoveModal,
          },
        ]}
      />
      <UpdateMirrorModal
        isOpen={isUpdateModalOpen}
        close={closeUpdateModal}
        mirrorDisplayName={mirrorDisplayName}
        mirrorName={mirrorName}
      />
      <RemoveMirrorModal
        isOpen={isRemoveModalOpen}
        close={closeRemoveModal}
        mirrorDisplayName={mirrorDisplayName}
        mirrorName={mirrorName}
      />
    </>
  );
};

export default MirrorActions;
