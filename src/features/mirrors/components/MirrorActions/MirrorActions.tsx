import ListActions from "@/components/layout/ListActions";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import UpdateMirrorModal from "../UpdateMirrorModal";
import RemoveMirrorModal from "../RemoveMirrorModal";
import {
  NoPublicationTargetsModal,
  useGetPublicationTargets,
} from "@/features/publication-targets";

interface MirrorActionsProps {
  readonly mirrorDisplayName: string;
  readonly mirrorName: string;
  readonly inProgress: boolean;
}

const MirrorActions: FC<MirrorActionsProps> = ({
  mirrorDisplayName,
  mirrorName,
  inProgress,
}) => {
  const { setPageParams, createPageParamsSetter } = usePageParams();
  const { publicationTargets, isGettingPublicationTargets } =
    useGetPublicationTargets();

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
        name: mirrorName,
      });
    } else {
      openNoPublicationTargetsModal();
    }
  };

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
          inProgress
            ? {
                icon: "spinner u-animation--spin",
                label: "Updating",
                disabled: true,
                tooltipMessage: "You must wait for this action to be completed to trigger a new update.",
              }
            : {
                icon: "restart",
                label: "Update",
                onClick: openUpdateModal,
              },
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
      {isNoPublicationTargetsModalOpen && (
        <NoPublicationTargetsModal close={closeNoPublicationTargetsModal} />
      )}
    </>
  );
};

export default MirrorActions;
