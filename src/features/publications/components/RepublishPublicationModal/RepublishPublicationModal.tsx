import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import type { Publication } from "../../types";
import { usePublishPublication } from "../../api";

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
        publicationName: publication.name,
        body: { forceOverwrite: true, forceCleanup: false },
      });

      notify.success({
        title: "Publication republished",
        message: `Publication "${publication.label}" has been queued for republishing.`,
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
      title={`Republish ${publication.label}`}
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
