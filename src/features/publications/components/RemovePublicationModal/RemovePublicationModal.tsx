import type { TextConfirmationModalProps } from "@/components/form/TextConfirmationModal";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import { useDeletePublication } from "../../api";
import type { Publication } from "@canonical/landscape-openapi";
import usePageParams from "@/hooks/usePageParams/usePageParams";

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
  const { deletePublication, isRemovingPublication } = useDeletePublication();
  const { closeSidePanel } = usePageParams();

  const handleRemovePublication = async () => {
    try {
      await deletePublication({ publicationName: publication.name ?? "" }); // TODO: change when the api is updated

      notify.success({
        title: `You have successfully removed ${publication.displayName}`,
        message: "The publication has been removed from Landscape.",
      });
    } catch (error) {
      debug(error);
    } finally {
      close();
      closeSidePanel();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ConfirmationModal
      renderInPortal
      title={`Remove ${publication.displayName}`}
      confirmButtonLabel="Remove publication"
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
