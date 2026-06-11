import { useEffect, type FC } from "react";
import { Button, Icon, ICONS, Tooltip } from "@canonical/react-components";
import { useListPublicationTargets } from "../../../../api";
import UpdateMirrorModal from "../../../UpdateMirrorModal";
import { useBoolean } from "usehooks-ts";
import RemoveMirrorModal from "../../../RemoveMirrorModal";
import { NoPublicationTargetsModal } from "@/features/publication-targets";
import usePageParams from "@/hooks/usePageParams/usePageParams";
import type { Operation } from "@/features/operations";

interface MirrorDetailsActionBlockProps {
  readonly displayName: string;
  readonly operation?: Operation;
}

const MirrorDetailsActionBlock: FC<MirrorDetailsActionBlockProps> = ({
  displayName,
  operation,
}) => {
  const { name, updateModal, createSidePathPusher, sidePath, setPageParams } =
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

  const { publicationTargets = [] } = useListPublicationTargets({
    pageSize: 1000,
  }).data.data;

  const tryPublish = () => {
    if (publicationTargets.length) {
      setPageParams({
        sidePath: [...sidePath, "publish"],
      });
    } else {
      openNoPublicationTargetsModal();
    }
  };

  useEffect(() => {
      if (updateModal) {
        openUpdateModal();
      }
    }, [openUpdateModal, updateModal]);
  
    const closeAndClearUpdateModal = () => {
      closeUpdateModal();
      setPageParams({
        updateModal: false,
      });
    };

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
          {operation && !operation.done
            ? <Tooltip
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
            : <Button
                type="button"
                hasIcon
                className="p-segmented-control__button"
                onClick={openUpdateModal}
              >
                <Icon name="restart" />
                <span>Update</span>
              </Button>
          }
          <Button
            type="button"
            hasIcon
            className="p-segmented-control__button"
            onClick={tryPublish}
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
        close={closeAndClearUpdateModal}
        mirrorDisplayName={displayName}
        mirrorName={name}
      />
      <RemoveMirrorModal
        isOpen={isRemoveModalOpen}
        close={closeRemoveModal}
        mirrorDisplayName={displayName}
        mirrorName={name}
      />
      {isNoPublicationTargetsModalOpen && (
        <NoPublicationTargetsModal close={closeNoPublicationTargetsModal} />
      )}
    </>
  );
};

export default MirrorDetailsActionBlock;
