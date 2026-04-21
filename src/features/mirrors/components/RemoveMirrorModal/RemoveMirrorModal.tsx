import useDebug from "@/hooks/useDebug";
import { ConfirmationModal, Icon } from "@canonical/react-components";
import { Suspense, type FC } from "react";
import { useDeleteMirror } from "../../api";
import useNotify from "@/hooks/useNotify";
import RemoveMirrorModalBody from "./components/RemoveMirrorModalBody";
import LoadingState from "@/components/layout/LoadingState";

interface RemoveMirrorModalProps {
  readonly close: () => void;
  readonly mirrorDisplayName: string;
  readonly mirrorName: string;
}

const RemoveMirrorModal: FC<RemoveMirrorModalProps> = ({
  close,
  mirrorDisplayName,
  mirrorName,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();

  const { mutateAsync: deleteMirror, isPending: isDeletingMirror } =
    useDeleteMirror();

  const tryRemoveMirror = async () => {
    try {
      await deleteMirror({
        mirrorName,
      });

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
      <p>This mirror is associated with the following publications:</p>
      <Suspense fallback={<LoadingState />}>
        <RemoveMirrorModalBody mirrorName={mirrorName} />
      </Suspense>
      <p>
        After removal you won’t be able to update any of these publications, but
        they will continue to be available.{" "}
        <strong>This action is irreversible.</strong>
      </p>
    </ConfirmationModal>
  );
};

export default RemoveMirrorModal;
