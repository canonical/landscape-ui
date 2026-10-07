import { useEffect, type FC } from "react";
import { Button, Icon, ICONS, Tooltip } from "@canonical/react-components";
import type { Mirror } from "@canonical/landscape-openapi";
import { useBoolean } from "usehooks-ts";
import usePageParams from "@/hooks/usePageParams";
import {
  NoPublicationTargetsModal,
  useGetPublicationTargets,
} from "@/features/publication-targets";
import UpdateMirrorModal from "../../../UpdateMirrorModal";
import RemoveMirrorModal from "../../../RemoveMirrorModal";
import { useCanCancelOperations } from "@/features/operations";

interface MirrorDetailsActionBlockProps {
  readonly mirror: Mirror;
  readonly isUpdating: boolean;
}

const MirrorDetailsActionBlock: FC<MirrorDetailsActionBlockProps> = ({
  mirror,
  isUpdating,
}) => {
  const { name, updateModal, sidePath, setPageParams, createSidePathPusher } =
    usePageParams();

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

  const { publicationTargets, isGettingPublicationTargets } =
    useGetPublicationTargets();
  const canCancelOperations = useCanCancelOperations();

  const tryPublish = () => {
    if (publicationTargets.length) {
      setPageParams({
        sidePath: [...sidePath, "publish"],
      });
    } else {
      openNoPublicationTargetsModal();
    }
  };

  const isUpdateDisabled = isUpdating && !canCancelOperations;

  useEffect(() => {
    if (!updateModal) {
      return;
    }
    if (!isUpdateDisabled && !mirror.preserveSignatures) {
      openUpdateModal();
    }

    setPageParams({ updateModal: false });
  }, [mirror, openUpdateModal, setPageParams, updateModal, isUpdateDisabled]);

  return (
    <>
      <div className="p-segmented-control">
        <Button
          type="button"
          hasIcon
          className="p-segmented-control__button"
          onClick={createSidePathPusher("edit")}
        >
          <Icon name="edit" />
          <span>Edit</span>
        </Button>
        {!mirror.preserveSignatures &&
          (isUpdateDisabled ? (
            <Tooltip
              message="You must wait for this action to be completed to trigger a new update."
              position="btm-center"
            >
              <Button
                type="button"
                hasIcon
                className="p-segmented-control__button"
                disabled
              >
                <Icon name="spinner" className="u-animation--spin" />
                <span>Updating</span>
              </Button>
            </Tooltip>
          ) : (
            <Button
              type="button"
              hasIcon
              className="p-segmented-control__button"
              onClick={openUpdateModal}
            >
              <Icon name="restart" />
              <span>Update</span>
            </Button>
          ))}
        <Button
          type="button"
          hasIcon
          className="p-segmented-control__button"
          onClick={tryPublish}
          disabled={isGettingPublicationTargets}
        >
          <Icon name="upload" />
          <span>Publish</span>
        </Button>
        <Button
          type="button"
          hasIcon
          className="p-segmented-control__button"
          onClick={openRemoveModal}
        >
          <Icon name={`${ICONS.delete}--negative`} />
          <span className="u-text--negative">Remove</span>
        </Button>
      </div>
      <UpdateMirrorModal
        isOpen={isUpdateModalOpen}
        close={closeUpdateModal}
        mirror={mirror}
        isUpdating={isUpdating}
      />
      <RemoveMirrorModal
        isOpen={isRemoveModalOpen}
        close={closeRemoveModal}
        mirrorDisplayName={mirror.displayName}
        mirrorName={name}
      />
      {isNoPublicationTargetsModalOpen && (
        <NoPublicationTargetsModal close={closeNoPublicationTargetsModal} />
      )}
    </>
  );
};

export default MirrorDetailsActionBlock;
