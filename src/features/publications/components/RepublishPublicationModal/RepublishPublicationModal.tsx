import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { ConfirmationModal } from "@canonical/react-components";
import type { FC } from "react";
import { usePublishPublication } from "../../api";
import type { Publication } from "@canonical/landscape-openapi";
import usePageParams from "@/hooks/usePageParams/usePageParams";
import { useCancelOperation } from "@/features/operations";

interface RepublishPublicationModalProps {
  readonly publication: Publication;
  readonly isOpen: boolean;
  readonly isPublishing: boolean;
  readonly close: () => void;
}

const RepublishPublicationModal: FC<RepublishPublicationModalProps> = ({
  publication,
  isOpen,
  isPublishing,
  close,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { publishPublication, isPublishingPublication } =
    usePublishPublication();
  const { closeSidePanel } = usePageParams();
  const { cancelOperation, isCancelingOperation } = useCancelOperation();

  const handleRepublishPublication = async () => {
    try {
      if (isPublishing) {
        await cancelOperation(publication.lastOperation ?? "");
      }
      await publishPublication({ name: publication.name ?? "" });

      notify.success({
        title: `You have marked ${publication.displayName} to be republished`,
        message:
          "An activity has been queued to republish it to the designated target.",
      });

      closeSidePanel();
      close();
    } catch (error) {
      debug(error);
    }
  };

  if (!isOpen) {
    return null;
  }

  if (isPublishing) {
    return (
      <ConfirmationModal
        renderInPortal
        close={close}
        title={`${publication.displayName} is already being published`}
        confirmButtonLabel="Cancel and start new republication"
        confirmButtonLoading={isCancelingOperation || isPublishingPublication}
        confirmButtonAppearance="positive"
        onConfirm={handleRepublishPublication}
      >
        <p className="u-margin--bottom">
          You already have an ongoing publishing attempt. You can only have one
          active publishing attempt at a time.
          <br />
          <br />
          <strong>
            Starting a new publishing attempt will cancel the current one and
            trigger a new task.
          </strong>
        </p>
      </ConfirmationModal>
    );
  }

  return (
    <ConfirmationModal
      renderInPortal
      close={close}
      title={`Republish ${publication.displayName}`}
      confirmButtonLabel="Republish"
      confirmButtonAppearance="positive"
      confirmButtonLoading={isPublishingPublication}
      onConfirm={handleRepublishPublication}
    >
      <p className="u-margin--bottom">
        Republishing will update the contents of this publication with the
        latest state of its source mirror.
      </p>
    </ConfirmationModal>
  );
};

export default RepublishPublicationModal;
