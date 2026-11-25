import { useEffect, type FC } from "react";
import { Tooltip } from "@canonical/react-components";
import { Button } from "@canonical/react-ds-global";
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
import classes from "./MirrorDetailsActionBlock.module.scss";

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
      <div className={classes.actions}>
        <Button
          type="button"
          importance="secondary"
          icon="edit"
          onClick={createSidePathPusher("edit")}
        >
          Edit
        </Button>
        {!mirror.preserveSignatures &&
          (isUpdateDisabled ? (
            <Tooltip
              message="You must wait for this action to be completed to trigger a new update."
              position="btm-center"
            >
              <Button type="button" importance="secondary" loading disabled>
                Updating
              </Button>
            </Tooltip>
          ) : (
            <Button
              type="button"
              importance="secondary"
              icon="restart"
              onClick={openUpdateModal}
            >
              Update
            </Button>
          ))}
        <Button
          type="button"
          importance="secondary"
          icon="upload"
          onClick={tryPublish}
          disabled={isGettingPublicationTargets}
        >
          Publish
        </Button>
        <Button
          type="button"
          importance="secondary"
          icon="delete"
          onClick={openRemoveModal}
        >
          Remove
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
