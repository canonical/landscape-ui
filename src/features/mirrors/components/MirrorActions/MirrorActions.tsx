import ListActions from "@/components/layout/ListActions";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import UpdateMirrorModal from "../UpdateMirrorModal";
import RemoveMirrorModal from "../RemoveMirrorModal";
import { useListPublications, useListPublicationTargets } from "../..";
import { NoPublicationTargetsModal } from "@/features/publication-targets";

interface MirrorActionsProps {
  readonly mirrorDisplayName: string;
  readonly mirrorName: string;
}

const MirrorActions: FC<MirrorActionsProps> = ({
  mirrorDisplayName,
  mirrorName,
}) => {
  const { setPageParams, createPageParamsSetter } = usePageParams();

  const { publicationTargets = [] } = useListPublicationTargets({
    pageSize: 1000,
  }).data.data;

  const { publications = [] } = useListPublications({
    filter: `source="${mirrorName}"`,
    pageSize: 1000,
  }).data.data;

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
    if (publicationTargets.length || publications.length) {
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
          {
            icon: "restart",
            label: "Update",
            onClick: openUpdateModal,
          },
          {
            icon: "upload",
            label: "Publish",
            onClick: tryPublish,
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
