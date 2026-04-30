import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import { usePublishPublication } from "../../api";
import type { Publication } from "@canonical/landscape-openapi";

interface RepublishPublicationModalProps {
  readonly publication: Publication;
  readonly isOpen: boolean;
  readonly close: () => void;
}

const RepublishPublicationModal: FC<RepublishPublicationModalProps> = ({
  publication,
  isOpen,
  close,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { publishPublication, isPublishingPublication } =
    usePublishPublication();

  const handleRepublishPublication = async () => {
    try {
      await publishPublication({
        publicationName: publication.name ?? "", // TODO: change when the api is updated
        body: { forceOverwrite: true, forceCleanup: true },
      });

      notify.success({
        title: `You have marked ${publication.displayName} to be republished`,
        message:
          "This publication has been queued for republishing to the designated target.",
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
      close={close}
      title={`Republish ${publication.displayName}`}
      confirmButtonLabel="Republish"
      confirmButtonAppearance="positive"
      confirmButtonLoading={isPublishingPublication}
      confirmButtonDisabled={isPublishingPublication}
      onConfirm={handleRepublishPublication}
    >
      <p>
        Republishing will update the contents of this publication with the
        latest state of its source mirror.
      </p>
    </ConfirmationModal>
  );
};

export default RepublishPublicationModal;
