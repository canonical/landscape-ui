import ListActions from "@/components/layout/ListActions";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import type { Mirror } from "@canonical/landscape-openapi";
import { useBoolean } from "usehooks-ts";
import UpdateMirrorModal from "../UpdateMirrorModal";
import RemoveMirrorModal from "../RemoveMirrorModal";

interface MirrorActionsProps {
  readonly mirror: Mirror;
}

const MirrorActions: FC<MirrorActionsProps> = ({ mirror }) => {
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

  const { name: mirrorName } = mirror;

  if (mirrorName === undefined) {
    return null;
  }

  return (
    <>
      <ListActions
        actions={[
          {
            icon: "show",
            label: "View details",
            onClick: createPageParamsSetter({
              sidePath: ["view"],
              name: mirror.name,
            }),
          },
          {
            icon: "edit",
            label: "Edit",
            onClick: createPageParamsSetter({
              sidePath: ["edit"],
              name: mirror.name,
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
              name: mirror.name,
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
        mirrorDisplayName={mirror.displayName}
        mirrorName={mirrorName}
      />
      <RemoveMirrorModal
        isOpen={isRemoveModalOpen}
        close={closeRemoveModal}
        mirrorDisplayName={mirror.displayName}
        mirrorName={mirrorName}
      />
    </>
  );
};

export default MirrorActions;
