import useDebug from "@/hooks/useDebug";
import { ConfirmationModal, Icon } from "@canonical/react-components";
import type { FC } from "react";
import { useDeleteMirror, useListPublications } from "../../api";
import useNotify from "@/hooks/useNotify";
import MirrorPublicationsList from "../MirrorPublicationsList";
import usePageParams from "@/hooks/usePageParams";

interface RemoveMirrorModalProps {
  readonly close: () => void;
  readonly isOpen: boolean;
  readonly mirrorDisplayName: string;
  readonly mirrorName: string;
}

const RemoveMirrorModal: FC<RemoveMirrorModalProps> = ({
  close,
  isOpen,
  mirrorDisplayName,
  mirrorName,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { setPageParams } = usePageParams();

  const { publications = [] } = useListPublications({
    filter: `source="${mirrorName}"`,
    pageSize: 1000,
  }).data.data;

  const { mutateAsync: deleteMirror, isPending: isDeletingMirror } =
    useDeleteMirror();

  if (!isOpen) {
    return;
  }

  const tryRemoveMirror = async () => {
    try {
      await deleteMirror({
        mirrorName,
      });

      setPageParams({ sidePath: [], name: "" });
      close();

      notify.success({
        title: `You have successfully removed ${mirrorDisplayName}.`,
        message: "The mirror has been removed from Landscape.",
      });
    } catch (error) {
      debug(error);
    }
  };

  return (
    <ConfirmationModal
      confirmButtonLabel={
        <>
          <Icon name="delete" light />
          <span>Remove mirror</span>
        </>
      }
      onConfirm={tryRemoveMirror}
      confirmButtonAppearance="negative"
      title={`Remove ${mirrorDisplayName}`}
      close={close}
      confirmButtonLoading={isDeletingMirror}
    >
      {publications.length ? (
        <>
          <p>This mirror is associated with the following publications:</p>
          <MirrorPublicationsList publications={publications} />
          <p>
            After removal you won’t be able to update any of these publications,
            but they will continue to be available.{" "}
            <strong>This action is irreversible.</strong>
          </p>
        </>
      ) : (
        <p>
          This action will remove the mirror from Landscape and it won’t be
          available to be published in the future.{" "}
          <strong>This action is irreversible.</strong>
        </p>
      )}
    </ConfirmationModal>
  );
};

export default RemoveMirrorModal;
