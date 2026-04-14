import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import usePublishPublication from "../../api/usePublishPublication";
import type { Publication } from "../../types";

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
  const { publishPublicationQuery } = usePublishPublication();
  const {
    mutateAsync: publishPublication,
    isPending: isRepublishingPublication,
  } = publishPublicationQuery;

  const handleRepublishPublication = async () => {
    try {
      await publishPublication({
        publicationName: publication.name,
        body: {
          forceOverwrite: true,
          forceCleanup: false,
        },
      });

      notify.success({
        title: "Publication republished",
        message: `Publication "${publication.name}" has been queued for republishing.`,
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
      title={`Republish ${publication.name}`}
      confirmButtonLabel="Republish"
      confirmButtonAppearance="positive"
      confirmButtonLoading={isRepublishingPublication}
      confirmButtonDisabled={isRepublishingPublication}
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
