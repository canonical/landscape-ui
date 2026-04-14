import type { TextConfirmationModalProps } from "@/components/form/TextConfirmationModal";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import useDeletePublication from "../../api/useDeletePublication";
import type { Publication } from "../../types";

interface RemovePublicationModalProps extends Pick<
  TextConfirmationModalProps,
  "close" | "isOpen"
> {
  readonly publication: Publication;
}

const RemovePublicationModal: FC<RemovePublicationModalProps> = ({
  close,
  isOpen,
  publication,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { deletePublicationQuery } = useDeletePublication();
  const { mutateAsync: deletePublication, isPending: isRemovingPublication } =
    deletePublicationQuery;

  const handleRemovePublication = async () => {
    try {
      await deletePublication({ publicationName: publication.name });

      notify.success({
        title: "Publication removed",
        message: `Publication "${publication.name}" has been removed.`,
      });
    } catch (error) {
      debug(error);
    } finally {
      close();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ConfirmationModal
      renderInPortal
      title="Remove publication"
      confirmButtonLabel="Remove"
      confirmButtonAppearance="negative"
      confirmButtonLoading={isRemovingPublication}
      confirmButtonDisabled={isRemovingPublication}
      onConfirm={handleRemovePublication}
      close={close}
    >
      <p>
        Removing this publication will prevent you from being able to publish
        mirrors to it or manage it from Landscape. This WILL NOT remove the
        publication from its publication target. This action is{" "}
        <b>irreversible</b>.
      </p>
    </ConfirmationModal>
  );
};

export default RemovePublicationModal;
