import ListActions from "@/components/layout/ListActions";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import type { Mirror } from "@canonical/landscape-openapi";
import { useBoolean } from "usehooks-ts";
import UpdateMirrorModal from "../UpdateMirrorModal";
import RemoveMirrorModal from "../RemoveMirrorModal";
import {
  NoPublicationTargetsModal,
  useGetPublicationTargets,
} from "@/features/publication-targets";
import { useCanCancelOperations, useOperation } from "@/features/operations";

interface MirrorActionsProps {
  readonly mirror: Mirror;
}

const MirrorActions: FC<MirrorActionsProps> = ({ mirror }) => {
  const { setPageParams, createPageParamsSetter } = usePageParams();
  const { publicationTargets, isGettingPublicationTargets } =
    useGetPublicationTargets();
  const { isOperationInProgress } = useOperation();
  const isUpdating = isOperationInProgress(mirror.lastOperation);
  const canCancelOperations = useCanCancelOperations();

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
  const {
    value: isNoPublicationTargetsModalOpen,
    setTrue: openNoPublicationTargetsModal,
    setFalse: closeNoPublicationTargetsModal,
  } = useBoolean();

  const tryPublish = () => {
    if (publicationTargets.length) {
      setPageParams({
        sidePath: ["publish"],
        name: mirror.name,
      });
    } else {
      openNoPublicationTargetsModal();
    }
  };

  return (
    <>
      <ListActions
        toggleAriaLabel={`${mirror.displayName} mirror actions`}
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
          ...(!mirror.preserveSignatures
            ? [
                !canCancelOperations && isUpdating
                  ? {
                      icon: "spinner u-animation--spin",
                      label: "Updating",
                      disabled: true,
                    }
                  : {
                      icon: "restart",
                      label: "Update",
                      onClick: openUpdateModal,
                    },
              ]
            : []),
          {
            icon: "upload",
            label: "Publish",
            onClick: tryPublish,
            disabled: isGettingPublicationTargets,
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
        isUpdating={isUpdating}
        close={closeUpdateModal}
        mirror={mirror}
      />
      <RemoveMirrorModal
        isOpen={isRemoveModalOpen}
        close={closeRemoveModal}
        mirrorDisplayName={mirror.displayName}
        mirrorName={mirror.name ?? ""}
      />
      {isNoPublicationTargetsModalOpen && (
        <NoPublicationTargetsModal close={closeNoPublicationTargetsModal} />
      )}
    </>
  );
};

export default MirrorActions;
